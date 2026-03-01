/**
 * Google Meet Caption Capture Extension with AI Summarization
 * @file content.js
 * @version 2.0
 * @license MIT
 */

(function () {
  let captionsEnabled = false;
  let captionsButton = null;
  let transcriptArea = null;
  let captionsContainerObserver = null;
  let previousCaptionsHash = '';
  let currentRawTranscript = '';
  const groq_api_key = '';

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  const getFormattedCaptions = () => {
    const captionEntries = Array.from(document.querySelectorAll('div[aria-label="Captions"] .nMcdL.bj4p3b'));

    const formatted = captionEntries
      .map((entry) => {
        const speaker = entry.querySelector('.NWpY1d')?.textContent || 'Unknown';
        const text = entry.querySelector('.bh44bd.VbkSUe')?.textContent || '';
        return `${speaker}: ${text}`;
      })
      .join('\n');

    if (!formatted) return;

    currentRawTranscript = formatted; // Store raw transcript for AI questions
    return formatted;
  };

  const summarizeTranscript = async (transcriptContent) => {
    if (!transcriptContent || transcriptContent.trim() === '') return '';

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groq_api_key}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'Generate concise meeting summaries with bullet points. Highlight key decisions, action items, and main discussion topics. Keep under 200 words. Keep it plain-text, for bullets use hyphen.'
            },
            {
              role: 'user',
              content: `Meeting transcript:\n${transcriptContent}`
            }
          ]
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      return data?.choices[0]?.message?.content || 'No summary available';
    } catch (error) {
      console.error('Summarization error:', error);
      return 'Summary unavailable - check console for details';
    }
  };

  const updateTranscript = debounce(async () => {
    if (!transcriptArea) return;

    const currentCaptions = getFormattedCaptions();
    const newHash = hashCode(currentCaptions);

    if (newHash && newHash !== previousCaptionsHash) {
      previousCaptionsHash = newHash;

      // Show loading state
      transcriptArea.value = transcriptArea.value.replace(/Generating summary\.\.\.$/, '') + '\nGenerating summary...';

      // Get and display summary
      const summary = await summarizeTranscript(currentCaptions);
      transcriptArea.value = summary.replace(/Generating summary\.\.\./g, '');
      transcriptArea.scrollTop = transcriptArea.scrollHeight;
    }
  }, 500); // 3-second update interval

  function setupTranscriptSystem() {
    transcriptArea = document.querySelector('.manali-panel .transcript-container textarea');
    document.querySelector('#aiQuestion')?.addEventListener('keypress', async (event) => {
      if (event.key === 'Enter') {
        const question = event.target.value;
        if (!question) return;

        event.target.value = '';
        document.querySelector('.agent-conversation').innerHTML = 'Loading...';

        try {
          console.log(currentRawTranscript);
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groq_api_key}`
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                {
                  role: 'user',
                  content: `Here's the meeting transcript: ${currentRawTranscript}. Answer my question: ${question}. Keep it within 100 words.`
                }
              ]
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          document.querySelector('.agent-conversation').innerHTML = data?.choices[0]?.message?.content;
        } catch (error) {
          console.error('Error fetching completion:', error);
        }
      }
    });

    const captionsContainer = document.querySelector('div[aria-label="Captions"]');
    if (captionsContainer) {
      transcriptArea.value = 'Starting meeting summary...';
      updateTranscript();
      captionsContainerObserver = new MutationObserver(updateTranscript);
      captionsContainerObserver.observe(captionsContainer, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  function isUserInMeeting() {
    const leaveButton = document.querySelector('[aria-label="Leave call"]');
    return !!leaveButton;
  }

  function onPageLoad() {
    const meetingObserver = new MutationObserver((_, observer) => {
      if (isUserInMeeting()) {
        observer.disconnect();
        setupCaptionsObservers();

        fetch(chrome.runtime.getURL('/panel.html'))
          .then((r) => r.text())
          .then((html) => {
            document.body.insertAdjacentHTML('beforeend', html);
          });
      }
    });

    meetingObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function setupCaptionsObservers() {
    const captionsObserver = new MutationObserver((_, obs) => {
      captionsButton = document.querySelector('[aria-label="Turn on captions"], [aria-label="Turn off captions"]');

      if (captionsButton) {
        obs.disconnect();
        turnOnCaptions();

        setTimeout(setupTranscriptSystem, 2000);

        const statusObserver = new MutationObserver(() => {
          const currentStatus = captionsButton.getAttribute('aria-pressed') === 'true';
          if (currentStatus !== captionsEnabled) {
            captionsEnabled = currentStatus;
            if (transcriptArea) {
              if (transcriptArea.value) {
                transcriptArea.value += `\n\n(Captions ${captionsEnabled ? 'enabled' : 'disabled'})\n\n`;
              } else {
                transcriptArea.value = `(Captions ${captionsEnabled ? 'enabled' : 'disabled'})`;
              }
            }
          }
        });

        statusObserver.observe(captionsButton, {
          attributes: true,
          attributeFilter: ['aria-pressed']
        });
      }
    });

    captionsObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function turnOnCaptions() {
    if (captionsButton?.getAttribute('aria-pressed') === 'false') {
      captionsButton.click();
    }
  }

  function cleanup() {
    if (captionsContainerObserver) {
      captionsContainerObserver.disconnect();
      captionsContainerObserver = null;
    }

    previousCaptionsHash = '';
    transcriptArea = null;
  }

  window.addEventListener('beforeunload', cleanup);

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(onPageLoad, 1);
  } else {
    document.addEventListener('DOMContentLoaded', onPageLoad);
  }
})();

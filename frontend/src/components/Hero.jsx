import UploadComponent from "./UploadComponent";

export default function Hero({ onFileUploaded, showUploadButton }) {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">
      <h2 className="text-4xl md:text-6xl font-extrabold md:leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">
      Your meeting's memory, minus the mess.
      </h2>
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
      Record, transcribe, and understand every meeting:) mana.ai's magic handle the details while you stay in the moment.
      </p>

      {showUploadButton && (
        <UploadComponent onFileSelect={onFileUploaded} />
      )}
    </section>
  );
}

export default function UploadButton({ onClick }) {
    return (
      <button
        className="bg-primary hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow transition"
        onClick={onClick}
      >
        Upload
      </button>
    );
  }
  
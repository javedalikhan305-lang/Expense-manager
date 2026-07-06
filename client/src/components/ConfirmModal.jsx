const ConfirmModal = ({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 shadow-soft">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm text-fintech-muted">{message}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-5 py-3 text-sm font-semibold text-fintech-text transition hover:border-fintech-primary hover:text-fintech-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-fintech-danger px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

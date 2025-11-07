import React from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-amber-200 p-6">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">Confirm Delete</h2>
        <p className="text-amber-700 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-amber-900">{userName}</span>?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-md hover:shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

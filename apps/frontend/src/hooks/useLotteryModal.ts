import { useState } from 'react';

const UseLotteryModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const handleConfirm = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  return { isModalOpen, openModal, handleConfirm, handleCancel };
};

export default UseLotteryModal;

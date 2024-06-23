import { useFlashMessage } from "../../hooks/flash-message";

const FlashMessage = () => {
  const { message } = useFlashMessage();

  if (!message) return null;

  return (
    <div className="flash-message">
      {message}
    </div>
  );
};

export default FlashMessage;
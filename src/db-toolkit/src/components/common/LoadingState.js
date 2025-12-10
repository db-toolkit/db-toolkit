import { Spinner } from './Spinner';

export function LoadingState({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner size={fullScreen ? 48 : 32} />
      <p className="text-gray-600">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{content}</div>;
}

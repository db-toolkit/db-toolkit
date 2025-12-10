export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon size={48} className="text-gray-400 dark:text-gray-500 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      {description && <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>}
      {action}
    </div>
  );
}

interface ChatHeaderProps {
  userId: number;
  propertyId: number | null;
}

export default function ChatHeader({
  userId,
  propertyId,
}: ChatHeaderProps) {
  return (
    <div className="border-b border-slate-200 p-4 font-semibold">
      <h2 className="text-slate-900">User #{userId}</h2>

      {propertyId !== null && (
        <p className="mt-1 text-xs font-normal text-slate-500">
          Property #{propertyId}
        </p>
      )}
    </div>
  );
}
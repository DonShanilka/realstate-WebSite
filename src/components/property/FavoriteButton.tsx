import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addFavorite, fetchFavorites, removeFavorite } from "../../features/favorites/favorites.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

interface FavoriteButtonProps {
  propertyId: number;
  returnTo?: string;
  className?: string;
}

export function FavoriteButton({
  propertyId,
  returnTo = `/properties/${propertyId}`,
  className = "absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-xl text-slate-900 shadow-sm transition hover:scale-105 hover:bg-white",
}: FavoriteButtonProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { items, status } = useAppSelector((state) => state.favorites);
  const isFavorite = items.some((favorite) => favorite.property_id === propertyId);

  useEffect(() => {
    if (token && status === "idle") void dispatch(fetchFavorites());
  }, [dispatch, status, token]);

  const label = isFavorite ? "Remove from favorites" : "Add to favorites";

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        if (!token) {
          navigate("/login", { state: { returnTo } });
          return;
        }
        if (isFavorite) void dispatch(removeFavorite(propertyId));
        else void dispatch(addFavorite(propertyId));
      }}
      aria-label={label}
      title={token ? label : "Sign in to save properties"}
      className={className}
    >
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}

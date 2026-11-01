export default function BookCover3D({ book }) {
  return (
    <div className="mx-auto w-56 [perspective:1000px] lg:w-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-l-[3px] rounded-r-md shadow-[22px_32px_50px_-14px_rgba(20,40,30,0.55)] transition-transform duration-500 [transform:rotateY(-10deg)] hover:[transform:rotateY(0deg)]">
        <img src={book.cover} alt={`${book.title} cover`} className="h-full w-full object-cover" />
        <div className="absolute left-0 top-0 h-full w-3 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute left-3 top-0 h-full w-px bg-white/30" />
      </div>
    </div>
  );
}

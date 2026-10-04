"use client";

export default function DesktopAppUpsell() {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-indigo-500/30 bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="text-2xl hidden sm:block">💻</div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base leading-tight">
              Get the Native Desktop App
            </h4>
            <p className="text-indigo-200 text-xs sm:text-sm">
              Enjoy a faster, fully offline standalone experience for Windows & Mac.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-white text-right">
            <div className="text-xs text-indigo-300 line-through leading-none mb-0.5">
              $49
            </div>
            <div className="font-bold text-lg leading-none">$23</div>
          </div>
          <button
            onClick={() =>
              window.open(
                "https://wa.me/212754764704?text=I%20want%20to%20buy%20the%20Desktop%20App%20for%20%2423",
                "_blank"
              )
            }
            className="h-10 px-6 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-lg shadow-sm transition-all hover:scale-105 cursor-pointer text-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
      {/* Spacer so nothing hides behind it */}
      <div className="h-24 sm:h-16 w-full"></div>
    </>
  );
}

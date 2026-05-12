export default function StatCard({ title, value }) {
  return (
    <div className="bg-[#1a1a1a] p-4 sm:p-5 md:p-6 rounded-xl border border-[#7A0C0C] w-full min-w-0 overflow-hidden">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <h3 className="
        text-lg
        sm:text-xl
        md:text-2xl
        lg:text-3xl
        font-bold
        mt-2
        break-words
        leading-tight
      ">
        {value}
      </h3>

    </div>
  );
}
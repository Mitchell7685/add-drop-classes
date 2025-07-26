import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#282828] text-[#ebdbb2]">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-[#fabd2f]">
            Course Manager
          </h1>
          <p className="text-xl mb-8 text-[#a89984]">
            Add and drop courses with ease
          </p>
          <p className="text-lg mb-12 text-[#bdae93] max-w-2xl mx-auto">
            Manage your academic schedule efficiently. Browse available courses, 
            add new ones to your schedule, or drop courses you no longer need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 min-w-[150px]">
                Login
              </button>
            </Link>
            
            <Link href="/courses">
              <button className="bg-[#d79921] hover:bg-[#fabd2f] text-[#282828] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 min-w-[150px]">
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white font-sans">
      <div className="w-full max-w-xs sm:max-w-sm mx-auto p-8 rounded-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-10 mt-2 text-center">로그인</h1>
        <form className="w-full flex flex-col gap-6">
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="아이디를 입력해주세요."
              className="w-full pl-8 pr-2 py-2 border-b border-gray-300 focus:outline-none focus:border-gray-500 text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          <div className="relative mt-2">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A4.75 4.75 0 007.75 6.75v3.75m8.75 0a2.25 2.25 0 01-4.5 0m4.5 0h-4.5m0 0V6.75m0 3.75v6.75m0 0h4.5m-4.5 0h-4.5" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              className="w-full pl-8 pr-10 py-2 border-b border-gray-300 focus:outline-none focus:border-gray-500 text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.338 7.522 19.5 12 19.5c1.658 0 3.237-.336 4.646-.94M21.065 11.999c-.272-.74-.635-1.442-1.08-2.09M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
              </svg>
            </span>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-teal-600 mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 inline">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
            <span className="text-sm text-gray-700 select-none">ID 기억하기</span>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded shadow-md transition-all"
          >
            로그인
          </button>
        </form>
      </div>
      <footer className="mt-12 text-xs text-gray-500 text-center select-none">
        © 2025 WITHTEC All rights reserved.v0.1.0
      </footer>
    </div>
  );
}

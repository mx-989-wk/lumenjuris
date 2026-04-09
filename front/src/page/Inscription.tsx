import SignupForm from "../components/auth/SignupForm";

export function Inscription() {
  return (
    <>
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10"></header>
      <div className="bg-lumenjuris-background min-h-[calc(100vh-64px)]">
        <div className="w-[800px] mx-auto pt-10 flex flex-col items-center gap-5">
          <h1>Créez un compte</h1>
          <SignupForm />
        </div>
      </div>
    </>
  );
}

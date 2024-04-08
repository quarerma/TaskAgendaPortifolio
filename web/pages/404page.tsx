export const FourOhFourPage = () => {
  const handleClick = () => {
    window.location.href = "/login";
  };
  return (
    <div className="bg-yellow-200 w-screen h-screen">
      <div className="bg-amber-100 border-yellow-500 border absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 text-red-500 rounded-sm min-h-[260px] max-w-[360px] itens-center justify-center text-center">
        <h1 className="text-2xl font-medium  p-2">404</h1>
        <div className="w-[300px] gap-y-8 flex m-6 flex-col">
          <h2>Página não encontrada</h2>
        </div>
        <button
          className="p-2 text-2xl text-amber-900 bg-amber-300 border border-black rounded-md"
          onClick={handleClick}
        >
          Ir para a Home
        </button>
      </div>
    </div>
  );
};

export default FourOhFourPage;

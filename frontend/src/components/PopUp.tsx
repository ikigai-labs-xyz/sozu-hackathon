

const PopUp() {
return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-8">
        <h2 className="text-xl font-bold mb-4">Popup Content</h2>
        <p>This is the popup window content.</p>
      </div>
    </div>
);


}

export default PopUp;
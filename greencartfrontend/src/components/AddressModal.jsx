const AddressModal = ({ isOpen, onClose, handleCreateNewAddress, newAddressData, setNewAddressData }) => {
  if (!isOpen) return null;

  const fields = [
    { label: "City/Village", key: "cityVillage" },
    { label: "Pincode", key: "pincode" },
    { label: "State", key: "state" },
    { label: "Country", key: "country" },
    { label: "Street or Society", key: "streetOrSociety" }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

        {fields.map(({ label, key }) => (
          <input
            key={key}
            type="text"
            placeholder={label}
            value={newAddressData[key] || ""}
            onChange={(e) => setNewAddressData({ ...newAddressData, [key]: e.target.value })}
            className="w-full border p-2 mb-2"
          />
        ))}

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button onClick={handleCreateNewAddress} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
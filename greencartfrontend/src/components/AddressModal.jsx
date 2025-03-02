const AddressModal = ({ isOpen, onClose, onSave, newAddressData, setNewAddressData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
        <input
          type="text"
          placeholder="City/Village"
          value={newAddressData.cityVillage}
          onChange={(e) => setNewAddressData({ ...newAddressData, cityVillage: e.target.value })}
          className="w-full border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Pincode"
          value={newAddressData.pincode}
          onChange={(e) => setNewAddressData({ ...newAddressData, pincode: e.target.value })}
          className="w-full border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="State"
          value={newAddressData.state}
          onChange={(e) => setNewAddressData({ ...newAddressData, state: e.target.value })}
          className="w-full border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Country"
          value={newAddressData.country}
          onChange={(e) => setNewAddressData({ ...newAddressData, country: e.target.value })}
          className="w-full border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Street or Society"
          value={newAddressData.streetOrSociety}
          onChange={(e) => setNewAddressData({ ...newAddressData, streetOrSociety: e.target.value })}
          className="w-full border p-2 mb-4"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;

"use client";

import { useEffect, useState } from "react";
import { createClient } from "../components/supabaseBrowser";
import {
  addAddress,
  deleteAddress,
  getMyAddresses,
  setDefaultAddress,
} from "../components/addressDb";
import { getErrorMessage } from "../components/errorUtils";

export default function AddressesPage() {
  const supabase = createClient();

  const [userId, setUserId] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const loadAddresses = async (uid: string) => {
    const data = await getMyAddresses(uid);
    setAddresses(data || []);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setMessage("Please login first");
          setLoading(false);
          return;
        }

        setUserId(user.id);
        await loadAddresses(user.id);
      } catch (error) {
        setMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleAdd = async () => {
    try {
      if (!userId) {
        setMessage("Please login first");
        return;
      }

      if (
        !fullName.trim() ||
        !phone.trim() ||
        !line1.trim() ||
        !city.trim() ||
        !stateName.trim() ||
        !pincode.trim()
      ) {
        setMessage("Please fill all address fields");
        return;
      }

      await addAddress({
        user_id: userId,
        full_name: fullName,
        phone,
        line1,
        city,
        state: stateName,
        pincode,
        is_default: addresses.length === 0,
      });

      setFullName("");
      setPhone("");
      setLine1("");
      setCity("");
      setStateName("");
      setPincode("");
      setMessage("Address added");

      await loadAddresses(userId);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
      setMessage("Address deleted");
      await loadAddresses(userId);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleDefault = async (id: number) => {
    try {
      await setDefaultAddress(userId, id);
      setMessage("Default address updated");
      await loadAddresses(userId);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Saved Addresses</h1>

        {message && (
          <div className="mt-4 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold">Add Address</h2>

            <div className="mt-6 space-y-4">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              <textarea
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="Address Line"
                rows={4}
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              <input
                list="cities"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />
              <datalist id="cities">
                <option value="Kanpur" />
                <option value="Lucknow" />
                <option value="Delhi" />
                <option value="Mumbai" />
                <option value="Bangalore" />
                <option value="Chennai" />
                <option value="Kolkata" />
                <option value="Hyderabad" />
                <option value="Pune" />
                <option value="Ahmedabad" />
                <option value="Jaipur" />
                <option value="Noida" />
              </datalist>

              <input
                list="states"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="State"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />
              <datalist id="states">
                <option value="Uttar Pradesh" />
                <option value="Delhi" />
                <option value="Maharashtra" />
                <option value="Karnataka" />
                <option value="Tamil Nadu" />
                <option value="West Bengal" />
                <option value="Telangana" />
                <option value="Gujarat" />
                <option value="Rajasthan" />
                <option value="Madhya Pradesh" />
                <option value="Punjab" />
                <option value="Haryana" />
              </datalist>

              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              <button
                onClick={handleAdd}
                className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black hover:bg-zinc-200"
              >
                Save Address
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold">My Addresses</h2>

            {loading ? (
              <p className="mt-6 text-zinc-400">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="mt-6 text-zinc-400">No addresses saved yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-2xl border border-white/10 bg-black p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{address.full_name}</p>
                        <p className="mt-1 text-sm text-zinc-400">{address.phone}</p>
                        <p className="mt-2 text-sm text-zinc-400">
                          {address.line1}, {address.city}, {address.state} - {address.pincode}
                        </p>

                        {address.is_default && (
                          <p className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                            Default
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {!address.is_default && (
                          <button
                            onClick={() => handleDefault(address.id)}
                            className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-black"
                          >
                            Set Default
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(address.id)}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
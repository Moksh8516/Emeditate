/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";

type Center = {
  _id: string;
  name: string;
  address?: string;
  country?: string;
  state?: string;
  district?: string;
  location?: { lat: number; lng: number };
  [key: string]: any;
};

export default function CentersList() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);

  useEffect(() => {
    fetchCountries();
    // initial search
    searchCenters(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCountry) fetchStates(selectedCountry);
    setSelectedState("");
    setSelectedDistrict("");
    setDistricts([]);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) fetchDistricts(selectedState);
    setSelectedDistrict("");
  }, [selectedState]);

  async function fetchCountries() {
    try {
      const res = await axios.get(`${API_URL}/centers/countries`);
      console.log(res.data.data);
      setCountries(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStates(country: string) {
    try {
      const res = await axios.get(
        `${API_URL}/countries-with-states/${encodeURIComponent(country)}`
      );
      setStates(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchDistricts(stateName: string) {
    try {
      const res = await axios.post(`${API_URL}/districts`, {
        state: stateName,
      });
      setDistricts(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function searchCenters(page = 1) {
    setLoading(true);
    setError(null);
    try {
      pageRef.current = page;
      const params: any = { q: query, page, limit: 20 };
      if (selectedCountry) params.country = selectedCountry;
      if (selectedState) params.state = selectedState;
      if (selectedDistrict) params.district = selectedDistrict;

      const res = await axios.get(`${API_URL}/search`, { params });
      const data = res.data?.data || {
        centers: [],
        pagination: { totalPages: 1 },
      };
      if (page === 1) setCenters(data.centers || []);
      else setCenters((prev) => [...prev, ...(data.centers || [])]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch centers");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    const next = pageRef.current + 1;
    await searchCenters(next);
  }

  async function findNearby() {
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        setError("Geolocation not available");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const res = await axios.post(`${API_URL}/find-centers-nearby`, {
            lat: latitude,
            lng: longitude,
          });
          setCenters(res.data?.data?.centers || []);
        },
        (err) => {
          setError(err.message || "Location permission denied");
        }
      );
    } catch (err: any) {
      setError(err?.message || "Failed to find nearby centers");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search centers by name or keyword"
          className="col-span-2 p-2 border rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={() => searchCenters(1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Search
          </button>
          <button
            onClick={findNearby}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Find Nearby
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="p-2 border rounded"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((c: any) => (
            <option
              key={typeof c === "string" ? c : c.name}
              value={typeof c === "string" ? c : c.name}
            >
              {typeof c === "string" ? c : c.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">All States</option>
          {states.map((s: any) => (
            <option
              key={typeof s === "string" ? s : s.name}
              value={typeof s === "string" ? s : s.name}
            >
              {typeof s === "string" ? s : s.name}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="">All Districts</option>
          {districts.map((d: any) => (
            <option
              key={typeof d === "string" ? d : d.name}
              value={typeof d === "string" ? d : d.name}
            >
              {typeof d === "string" ? d : d.name}
            </option>
          ))}
        </select>

        <div className="flex items-center">
          <button
            onClick={() => {
              pageRef.current = 1;
              searchCenters(1);
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Apply
          </button>
        </div>
      </div>

      {loading && <div className="p-4 text-center">Loading...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      <div className="space-y-4">
        {centers.length === 0 && !loading && (
          <div className="p-4 text-gray-600">No centers found.</div>
        )}

        {centers.map((c) => (
          <div
            key={c._id}
            className="p-4 border rounded flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold">{c.name}</h3>
              <p className="text-sm text-gray-600">{c.address}</p>
              <p className="text-sm text-gray-500">
                {[c.district, c.state, c.country].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="text-right">
              <a href={`/centers/${c._id}`} className="text-indigo-600">
                View
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={loadMore}
          className="px-4 py-2 bg-indigo-500 text-white rounded"
        >
          Load more
        </button>
      </div>
    </div>
  );
}

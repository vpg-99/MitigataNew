// import { useState } from 'react'
import { useState, useEffect, useMemo } from "react";
import StatCard from "./components/StatCard";
import { FiUsers, FiUserCheck, FiUserMinus, FiUserX } from "react-icons/fi";
import { getData } from "./server/api";
import type { Record, Status } from "./types";
import SearchBar from "./components/UI/searchBar";
import DropDown from "./components/UI/dropDown";

const StatusOptions = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

export default function App() {
  const [data, setData] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getData()
      .then((data) => {
        setData(data as Record[]);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    if (!search&&status==="ALL") return data;
    const query = search.toLowerCase();
    return data.filter((record) =>
      (record.about.name.toLowerCase().includes(query)) && (record.about.status === status)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Users"
            value={data.length.toString()}
            icon={<FiUsers size={24} />}
          />
          <StatCard
            title="Active Users"
            value={data
              .filter((record) => record.about.status === "ACTIVE")
              .length.toString()}
            icon={<FiUserCheck size={24} />}
          />
          <StatCard
            title="Inactive Users"
            value={`${data
              .filter((record) => record.about.status === "INACTIVE")
              .length.toString()}%`}
            icon={<FiUserMinus size={24} />}
          />
          <StatCard
            title="Blocked Users"
            value={`${data
              .filter((record) => record.about.status === "BLOCKED")
              .length.toString()}%`}
            icon={<FiUserX size={24} />}
          />
        </div>
        <div className="flex justify-between items-center mb-6 gap-4">
          <SearchBar
            placeholder="Search by name"
            onChange={setSearch}
            setPage={setPage}
          />
          <DropDown
            options={StatusOptions}
            onChange={(value) => setStatus(value as Status)}
            value={status}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}

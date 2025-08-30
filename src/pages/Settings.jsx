import TableRow from "../components/TableRow";

const rows = [
    { index: 1, name: "P3-1", id: "36fd1e64-dc5d-4a52-a7c7-02e3b751427e", status: "Inside" },
    { index: 2, name: "P3-6", id: "86325917-cf55-4ced-857c-afa1f1c85b8f", status: "Outside" },
    { index: 3, name: "P4-3", id: "e9142af6-f61b-4df5-9c38-79f86cd8584c", status: "Inside" },
    { index: 4, name: "P4-2", id: "12527fa0-6441-4451-8af1-4689c19bf494", status: "Inside" },
    { index: 5, name: "P3-3", id: "b9b5b7d0-c941-44f8-916f-4c565a0eae42", status: "Inside" },
    { index: 6, name: "P4-5", id: "a6c7cccc-d00c-4d6d-8717-b38c2a97172e", status: "Outside" },
    { index: 7, name: "P4-1", id: "141cddfb-279a-4311-bfc1-44abbae47d82", status: "Inside" },
    { index: 8, name: "P3-4", id: "15adf128-5518-4a23-a4b7-6a8a7c427aea", status: "Inside" },
    { index: 9, name: "P3-5", id: "aa7eec70-cda7-493f-a523-809877fe4d34", status: "Outside" },
    { index: 10, name: "P3-2", id: "66859ed6-efea-40b8-acc0-b6ead857a424", status: "Inside" },
    { index: 11, name: "P4-4", id: "fdb929fe-6056-49b2-8a7b-bfa67841a7dc", status: "Inside" },
    { index: 12, name: "P4-6", id: "8dc9685f-a80b-4d95-ae19-da340efe89ab", status: "Outside" },
  ];
  
  const Settings = () => {
    return (
      <div className="w-full h-[93%] bg-white flex justify-center items-center">
        <div className="w-full px-6">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="border-b">
                <th className="h-12 px-4 font-medium text-black text-left">№</th>
                <th className="h-12 px-4 font-medium text-black text-left">Имя</th>
                <th className="h-12 px-4 font-medium text-black text-left">Id</th>
                <th className="h-12 px-4 font-medium text-black text-center">Статус</th>
                <th className="h-12 px-4 font-medium text-black text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <TableRow key={row.id} {...row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Settings;
  
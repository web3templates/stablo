const TablePreview = ({ table }) => {
  console.log("eee", table);

  if (!table) {
    return <p>Table: Add Values</p>;
  }
  const [head, ...rows] = table?.rows;
  return (
    <table width="100%">
      {head.cells.filter(Boolean).length > 0 && (
        <thead>
          <tr>
            {head.cells.map(cell => (
              <th style={{ textAlign: "left" }} key={cell}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.cells.map((cell, index) => {
              return <td key={cell}>{cell}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablePreview;

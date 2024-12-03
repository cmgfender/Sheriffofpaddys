document.getElementById("processFile").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput").files[0];
    if (!fileInput) {
      alert("Please upload a file first.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  
      processFile(rows);
    };
    reader.readAsArrayBuffer(fileInput);
  });
  
  function processFile(rows) {
    const output = document.getElementById("output");
    output.innerHTML = "";
  
    if (!rows.length) {
      output.innerHTML = "<p>No data found in the file.</p>";
      return;
    }
  
    // Normalize column names: Trim and convert to lowercase
    const normalizedRows = rows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key.trim().toLowerCase(), value])
      )
    );
  
    // Expanded field mappings
    const fieldMappings = {
      "first name": ["first name", "firstname", "first-name", "nombre", "fornafn", "prénom"],
      "last name": ["last name", "lastname", "last-name", "surname", "apellido", "eftirnafn"],
      "email": ["email", "email address", "correo", "courriel", "e-mail", "email id"],
      "company": ["company", "firma", "compañía", "organisation"],
      "assign to": ["assign to", "assignto", "zuweisen", "asignar"],
      "country": ["country", "land", "país", "nation"]
    };
  
    // Validate basic fields
    const requiredFields = Object.keys(fieldMappings);
    const missingBasic = validateColumns(normalizedRows, requiredFields, fieldMappings);
  
    // Handle "Assign To" fallback to "Country"
    if (missingBasic.includes("assign to") && !missingBasic.includes("country")) {
      missingBasic.splice(missingBasic.indexOf("assign to"), 1);
    }
  
    if (missingBasic.length) {
      output.innerHTML += `<p>Missing basic fields: ${missingBasic.join(", ")}</p>`;
      return;
    }
  
    // Ensure "Lead Status" is set to "Open" if present
    normalizedRows.forEach(row => {
      if (row["lead status"] && row["lead status"].toLowerCase() === "open") {
        row["lead status"] = "Open";
      }
    });
  
    // Add a check for proper data processing before download
    if (normalizedRows.length > 0) {
      exportToCSV(normalizedRows, "Updated_List.csv");
      output.innerHTML += "<p>File processed successfully! The updated file has been downloaded.</p>";
    } else {
      output.innerHTML += "<p>Error: No data to export after processing.</p>";
    }
  }
  
  function validateColumns(rows, fields, fieldMappings) {
    const missingFields = [];
  
    fields.forEach(field => {
      const alternatives = fieldMappings[field] || [field];
      const found = rows.some(row =>
        alternatives.some(alt => alt.toLowerCase() in row)
      );
      if (!found) missingFields.push(field);
    });
  
    return missingFields;
  }
  
  function exportToCSV(rows, filename) {
    try {
      const csvContent = [
        Object.keys(rows[0]).join(","), // Header row
        ...rows.map(row =>
          Object.values(row)
            .map(value => (typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value))
            .join(",")
        )
      ].join("\n");
  
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = "none";
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error during file download:", error);
      alert("Failed to download the CSV file. Check the console for details.");
    }
  }
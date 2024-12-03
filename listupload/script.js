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
  
      validateFile(rows);
    };
    reader.readAsArrayBuffer(fileInput);
  });
  
  function validateFile(rows) {
    const output = document.getElementById("output");
    output.innerHTML = "";
  
    if (!rows.length) {
      output.innerHTML = "<p>No data found in the file.</p>";
      return;
    }
  
    // Normalize column names to lowercase and trimmed
    const normalizedRows = rows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key.trim().toLowerCase(), value])
      )
    );
  
    // Phase 1: Basic Fields
    const requiredFields = ['first name', 'last name', 'email', 'company', 'assign to', 'country'];
    const missingBasic = validateColumns(normalizedRows, requiredFields);
  
    // Handle "Country" as a fallback for "Assign To"
    if (missingBasic.includes("assign to") && !missingBasic.includes("country")) {
      missingBasic.splice(missingBasic.indexOf("assign to"), 1);
    }
  
    if (missingBasic.length) {
      output.innerHTML += `<p>Missing basic fields: ${missingBasic.join(", ")}</p>`;
      return;
    }
  
    // Check if Name column needs splitting
    const nameColumn = normalizedRows.some(row => "name" in row);
    if (nameColumn) {
      if (confirm("Do you want to split the 'Name' column into 'First Name' and 'Last Name'?")) {
        normalizedRows.forEach(row => {
          if (row.name) {
            const [firstName, ...lastName] = row.name.split(" ");
            row["first name"] = firstName || "";
            row["last name"] = lastName.join(" ") || "";
          }
        });
      } else {
        output.innerHTML += "<p>Splitting name is required for upload.</p>";
        return;
      }
    }
  
    // Validate email domain for "Assign To"
    if (!normalizedRows.every(row => row["assign to"]?.endsWith("@calabrio.com"))) {
      output.innerHTML += "<p>Assign To must be an email ending in @calabrio.com.</p>";
      return;
    }
  
    // Phase 2: Optional Fields
    const optionalFields = ["phone", "industry", "job title"];
    const missingOptional = validateColumns(normalizedRows, optionalFields);
    if (missingOptional.length) {
      output.innerHTML += `<p>Optional fields missing: ${missingOptional.join(", ")}. Follow-up might be harder.</p>`;
    }
  
    // Phase 3: Attribution Fields
    const attributionFields = ["lead status", "lead activity recent", "lead category"];
    const missingAttribution = validateColumns(normalizedRows, attributionFields);
    if (missingAttribution.length) {
      missingAttribution.forEach(field => {
        normalizedRows.forEach(row => {
          if (field === "lead status") row["lead status"] = "open";
          else row[field] = prompt(`Enter value for ${field}:`);
        });
      });
    }
  
    output.innerHTML += "<p>File processed successfully!</p>";
  }
  
  function validateColumns(rows, fields) {
    const missingFields = [];
  
    fields.forEach(field => {
      const found = rows.some(row => field in row);
      if (!found) missingFields.push(field);
    });
  
    return missingFields;
  }
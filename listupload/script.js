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
  
    // Phase 1: Basic Fields
    const requiredFields = ['First Name', 'Last Name', 'Email', 'Company', 'Assign To', 'Country'];
    const spellings = {
      "First Name": ["First Name", "FirstName", "Vorname", "Nombre", "Fornafn"],
      "Last Name": ["Last Name", "LastName", "Nachname", "Apellido", "Eftirnafn"],
      "Email": ["Email", "email", "email "],
      "Company": ["Company", "Firma", "Compañía", "Fyrirtæki"],
      "Assign To": ["Assign To", "AssignTo", "Zuweisen", "Asignar", "Úthluta"],
      "Country": ["Country", "Land", "País", "Landið"]
    };
  
    const missingBasic = validateColumns(rows, requiredFields, spellings);
  
    // "Country" can be used as a fallback for "Assign To"
    if (missingBasic.includes("Assign To") && !missingBasic.includes("Country")) {
      missingBasic.splice(missingBasic.indexOf("Assign To"), 1);
    }
  
    if (missingBasic.length) {
      output.innerHTML += `<p>Missing basic fields: ${missingBasic.join(", ")}</p>`;
      return;
    }
  
    // Check if Name column needs splitting
    const nameColumn = rows.some(row => "Name" in row);
    if (nameColumn) {
      if (confirm("Do you want to split the 'Name' column into 'First Name' and 'Last Name'?")) {
        rows.forEach(row => {
          if (row.Name) {
            const [firstName, ...lastName] = row.Name.split(" ");
            row["First Name"] = firstName || "";
            row["Last Name"] = lastName.join(" ") || "";
          }
        });
      } else {
        output.innerHTML += "<p>Splitting name is required for upload.</p>";
        return;
      }
    }
  
    // Validate email domain for "Assign To"
    if (!rows.every(row => row["Assign To"].endsWith("@calabrio.com"))) {
      output.innerHTML += "<p>Assign To must be an email ending in @calabrio.com.</p>";
      return;
    }
  
    // Phase 2: Optional Fields
    const optionalFields = ["Phone", "Industry", "Job Title"];
    const missingOptional = validateColumns(rows, optionalFields, spellings);
    if (missingOptional.length) {
      output.innerHTML += `<p>Optional fields missing: ${missingOptional.join(", ")}. Follow-up might be harder.</p>`;
    }
  
    // Phase 3: Attribution Fields
    const attributionFields = ["Lead Status", "Lead Activity Recent", "Lead Category"];
    const missingAttribution = validateColumns(rows, attributionFields, spellings);
    if (missingAttribution.length) {
      missingAttribution.forEach(field => {
        rows.forEach(row => {
          if (field === "Lead Status") row["Lead Status"] = "Open";
          else row[field] = prompt(`Enter value for ${field}:`);
        });
      });
    }
  
    output.innerHTML += "<p>File processed successfully!</p>";
  }
  
  function validateColumns(rows, fields, spellings) {
    const missingFields = [];
  
    fields.forEach(field => {
      const alternatives = spellings[field] || [field];
      const found = rows.some(row => alternatives.some(alt => alt in row));
      if (!found) missingFields.push(field);
    });
  
    return missingFields;
  }
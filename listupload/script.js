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
  
    // Normalize column names: Trim and convert to lowercase
    const normalizedRows = rows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key.trim().toLowerCase(), value])
      )
    );
  
    // Expanded field mappings
    const fieldMappings = {
      "first name": [
        "first name", "firstname", "first-name", "firsname", "vorname", "nombre", "fornafn", "prénom",
        "primernombre", "vornam", "förnamn", "förstanamn"
      ],
      "last name": [
        "last name", "lastname", "last-name", "surname", "sur name", "nachname", "apellido", "eftirnafn",
        "nachnam", "efternamn", "sobrenome", "nomdefamille"
      ],
      "email": [
        "email", "e-mail", "email address", "email-address", "correo electrónico", "correo", "eadresse",
        "emailadress", "netfang", "mel", "courriel", "emial", "emal", "mail", "mailadresse", "mailaddress"
      ],
      "company": [
        "company", "firm", "firma", "compañía", "fyrirtæki", "corporation", "enterprise", "sociedad",
        "societe", "unternehmen", "geschäft", "org", "organisation", "organization"
      ],
      "assign to": [
        "assign to", "assign-to", "assignto", "zuweisen", "asignar", "úthluta", "zuordnung", "asignación",
        "allouer", "zugewiesen", "asignado", "destinatario", "recipient"
      ],
      "country": [
        "country", "land", "país", "landið", "nation", "patria", "pays", "staat", "nazione", "paese",
        "ország", "országok"
      ],
      "phone": [
        "phone", "phone number", "phone-number", "telephone", "tel", "téléphone", "telefone", "telefonnummer",
        "número de teléfono", "sími", "teléfono", "telefon", "mobile", "mobiltelefon"
      ],
      "industry": [
        "industry", "branche", "indústria", "industrie", "industria", "grein", "szektor", "secteur",
        "setor", "sektor"
      ],
      "job title": [
        "job title", "jobtitle", "position", "job", "role", "puesto", "cargo", "profession", "beruf",
        "título de trabajo", "job designation", "arbeitsplatz", "funktion", "titel"
      ],
      "lead status": [
        "lead status", "lead_status", "status", "status del lead", "zustand des leads", "estado del lead",
        "statut du lead", "staða leiðar", "lead stato", "estado do lead"
      ],
      "lead activity recent": [
        "lead activity recent", "recent activity", "actividad reciente", "letzte aktivität", "aktivität",
        "activités récentes", "atividade recente", "nýleg virkni", "aktivitet"
      ],
      "lead category": [
        "lead category", "category", "categorie", "kategorie", "catégorie", "kategorija", "kategória",
        "categorie di lead", "categoria"
      ]
    };
  
    // Phase 1: Basic Fields Validation
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
  
    // Validate "Assign To" email domains
    if (!normalizedRows.every(row => row["assign to"]?.endsWith("@calabrio.com"))) {
      output.innerHTML += "<p>Assign To must be an email ending in @calabrio.com.</p>";
      return;
    }
  
    // Phase 2: Optional Fields Validation
    const optionalFields = ["phone", "industry", "job title"];
    const missingOptional = validateColumns(normalizedRows, optionalFields, fieldMappings);
    if (missingOptional.length) {
      output.innerHTML += `<p>Optional fields missing: ${missingOptional.join(", ")}. Follow-up might be harder.</p>`;
    }
  
    // Phase 3: Attribution Fields Validation
    const attributionFields = ["lead status", "lead activity recent", "lead category"];
    const missingAttribution = validateColumns(normalizedRows, attributionFields, fieldMappings);
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
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
      "first name": [
        "first name", "firstname", "first-name", "firsname", "vorname", "nombre", "fornafn", "prénom",
        "primernombre", "vornam", "förnamn", "förstanamn", "primeiro nome", "primeironome", "prenom",
        "förnamn", "nome", "given name", "given-name", "givenname", "prenom"
      ],
      "last name": [
        "last name", "lastname", "last-name", "surname", "sur name", "nachname", "apellido", "eftirnafn",
        "sobrenome", "nomdefamille", "efternamn", "sobrenome", "family name", "familyname", "famname",
        "apellido paterno", "nomdefamille", "familiya", "cognome"
      ],
      "email": [
        "email", "e-mail", "email address", "email-address", "correo electrónico", "correo", "eadresse",
        "emailadress", "netfang", "mel", "courriel", "emial", "emal", "mail", "mailadresse", "mailaddress",
        "email-id", "id email", "email id", "eaddress", "correo electronico"
      ],
      "company": [
        "company", "firm", "firma", "compañía", "fyrirtæki", "corporation", "enterprise", "sociedad",
        "societe", "unternehmen", "geschäft", "org", "organisation", "organization", "business",
        "business name", "nombre de empresa", "raison sociale", "organización", "firma"
      ],
      "assign to": [
        "assign to", "assign-to", "assignto", "zuweisen", "asignar", "úthluta", "zuordnung", "asignación",
        "allouer", "zugewiesen", "asignado", "destinatario", "recipient", "owner", "assignment", "allocated to"
      ],
      "country": [
        "country", "land", "país", "landið", "nation", "patria", "pays", "staat", "nazione", "paese",
        "ország", "országok", "country name", "país natal", "heimatland", "estado"
      ],
      "phone": [
        "phone", "phone number", "phone-number", "telephone", "tel", "téléphone", "telefone", "telefonnummer",
        "número de teléfono", "sími", "teléfono", "telefon", "mobile", "mobiltelefon", "cellphone", "cell",
        "mobile number", "número móvil"
      ],
      "industry": [
        "industry", "branche", "indústria", "industrie", "industria", "grein", "szektor", "secteur",
        "setor", "sektor", "line of work", "sector industrial", "branch"
      ],
      "job title": [
        "job title", "jobtitle", "position", "job", "role", "puesto", "cargo", "profession", "beruf",
        "título de trabajo", "job designation", "arbeitsplatz", "funktion", "titel", "job position",
        "jobname", "work title", "employment title"
      ],
      "lead status": [
        "lead status", "lead_status", "status", "status del lead", "zustand des leads", "estado del lead",
        "statut du lead", "staða leiðar", "lead stato", "estado do lead", "lead state", "estado de contacto"
      ],
      "lead activity recent": [
        "lead activity recent", "recent activity", "actividad reciente", "letzte aktivität", "aktivität",
        "activités récentes", "atividade recente", "nýleg virkni", "aktivitet", "latest activity"
      ],
      "lead category": [
        "lead category", "category", "categorie", "kategorie", "catégorie", "kategorija", "kategória",
        "categorie di lead", "categoria", "lead type", "tipo de lead"
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
  
    // Ensure "Lead Status" is set to "Open" if present
    normalizedRows.forEach(row => {
      if (row["lead status"] && row["lead status"].toLowerCase() === "open") {
        row["lead status"] = "Open";
      }
    });
  
    // Export the updated rows
    exportToCSV(normalizedRows, "Updated_List.csv");
    output.innerHTML += "<p>File processed successfully! The updated file has been downloaded.</p>";
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
  }
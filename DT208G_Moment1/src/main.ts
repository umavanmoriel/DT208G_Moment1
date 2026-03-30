

interface CourseInfo {
  code: string;
  name: string;
  progression: 'A' | 'B' | 'C';
  syllabus: string;
}

const addCourseButton = document.getElementById('addCourseButton') as HTMLButtonElement | null;

if (addCourseButton) {
  addCourseButton.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    addCourse();
  });
}

function addCourse(): void {
  const courseCodeInput = document.getElementById('code') as HTMLInputElement | null;
  const courseNameInput = document.getElementById('name') as HTMLInputElement | null;
  const progressionInput = document.getElementById('progression') as HTMLInputElement | null;
  const syllabusInput = document.getElementById('syllabus') as HTMLInputElement | null;

  // Rensa tidigare meddelanden
  const errorsElement = document.getElementById('errors') as HTMLDivElement | null;
  if (errorsElement) {
    errorsElement.innerHTML = ''; // Tar bort alla tidigare meddelanden
  }

  // Validering av inputs
  let errors: string[] = [];
  
  if (
    !courseCodeInput ||
    !courseNameInput ||
    !progressionInput ||
    !syllabusInput
  ) {
    errors.push('Inputs kunde inte hittas i DOM:en');
  }

  if (
    courseCodeInput.value === '' ||
    courseNameInput.value === '' ||
    progressionInput.value === '' ||
    syllabusInput.value === ''
  ) {
    errors.push('Fyll i alla fält');
  }

  if (/[!@#$%^&*()]/.test(courseCodeInput.value) || /[!@#$%^&*()]/.test(courseNameInput.value)) {
    errors.push('Kurskod och kursnamn får inte innehålla specialtecken');
  }

  if (progressionInput.value !== "A" && progressionInput.value !== "B" && progressionInput.value !== "C") {
    errors.push('Progression måste vara A, B eller C');
  }

  // Kontrollera om kurskoden redan finns
  const raw = localStorage.getItem('courseInfo');
  const courseInfo: CourseInfo[] = raw ? (JSON.parse(raw) as CourseInfo[]) : [];
  
  const kursKodFinns = courseInfo.some(kurs => kurs.code === courseCodeInput.value);
  if (kursKodFinns) {
    errors.push('Kurskoden måste vara unik. Denna kurskod finns redan.');
  }

  if (errors.length > 0) {
    errors.forEach((error: string) => {
      const errorListItem = document.createElement('li');
      const errorText = document.createTextNode(error);
      errorListItem.appendChild(errorText);
      errorsElement?.appendChild(errorListItem);
    });
    return;
  };

  courseInfo.push({
    code: courseCodeInput.value,
    name: courseNameInput.value,
    progression: progressionInput.value as 'A' | 'B' | 'C',
    syllabus: syllabusInput.value,
  });

  localStorage.setItem('courseInfo', JSON.stringify(courseInfo));

  // Rensa input-fälten
  courseCodeInput.value = '';
  courseNameInput.value = '';
  progressionInput.value = '';
  syllabusInput.value = '';


  // Meddelande visar att kursen är spårad
  const successMessage = document.createElement('li');
  successMessage.textContent = 'Kursen är sparad. Se tabellen nedan.';
  successMessage.style.color = 'green';
  errorsElement?.appendChild(successMessage);
}
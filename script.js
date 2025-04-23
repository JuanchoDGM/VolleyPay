let students = JSON.parse(localStorage.getItem('students')) || [];

    function saveToLocalStorage() {
      localStorage.setItem('students', JSON.stringify(students));
    }

    function renderTable() {
      const table = document.getElementById('studentsTable');
      table.innerHTML = '';
      students.forEach((student, index) => {
        const row = document.createElement('tr');
        const checkDisabled = student.monthlyPaid ? 'disabled' : '';

        row.innerHTML = `
          <td class="p-3 font-medium text-gray-700 whitespace-nowrap">${student.name}</td>
          ${student.weeks.map((paid, i) => `
            <td class="text-center">
              <input type="checkbox" class="week-checkbox accent-indigo-600" data-index="${index}" data-week="${i}" ${checkDisabled} ${paid ? 'checked' : ''}>
            </td>
          `).join('')}
          <td class="text-center">
            <input type="checkbox" class="monthly-checkbox accent-indigo-600" data-index="${index}" ${student.monthlyPaid ? 'checked' : ''}>
          </td>
          <td class="text-center">
            <button class="delete-button bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full" data-index="${index}" title="Eliminar">
              <i class="ph ph-trash"></i>
            </button>
          </td>
        `;
        table.appendChild(row);
      });
    }

    function addStudent() {
      const nameInput = document.getElementById('studentName');
      const name = nameInput.value.trim();
      if (!name) return;
      students.push({ name, weeks: [false, false, false, false], monthlyPaid: false });
      nameInput.value = '';
      saveToLocalStorage();
      renderTable();
    }

    function deleteStudent(index) {
      students.splice(index, 1);
      saveToLocalStorage();
      renderTable();
    }

    function toggleWeek(studentIndex, weekIndex) {
      const student = students[studentIndex];
      student.weeks[weekIndex] = !student.weeks[weekIndex];
      saveToLocalStorage();
      renderTable();
    }

    function toggleMonthly(index) {
      const student = students[index];
      student.monthlyPaid = !student.monthlyPaid;
      student.weeks = student.monthlyPaid ? [true, true, true, true] : [false, false, false, false];
      saveToLocalStorage();
      renderTable();
    }

    function resetCycle() {
      students = students.map(student => ({
        ...student,
        weeks: [false, false, false, false],
        monthlyPaid: false
      }));
      saveToLocalStorage();
      renderTable();
    }

    document.getElementById('addButton').addEventListener('click', addStudent);
    document.getElementById('resetButton').addEventListener('click', resetCycle);

    document.getElementById('studentsTable').addEventListener('click', (e) => {
      if (e.target.closest('.delete-button')) {
        const index = parseInt(e.target.closest('.delete-button').getAttribute('data-index'));
        deleteStudent(index);
      }
    });

    document.getElementById('studentsTable').addEventListener('change', (e) => {
      const target = e.target;
      if (target.classList.contains('week-checkbox')) {
        const index = parseInt(target.getAttribute('data-index'));
        const week = parseInt(target.getAttribute('data-week'));
        toggleWeek(index, week);
      }
      if (target.classList.contains('monthly-checkbox')) {
        const index = parseInt(target.getAttribute('data-index'));
        toggleMonthly(index);
      }
    });

    renderTable();
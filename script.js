const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-task");
const list = document.getElementById("task-list");
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
      createTask(task.text, task.completed, task.date, task.time, task.priority, task.recurring);
    });
    updateStats();
  };
  document.querySelectorAll(".filter-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      applyFilter(filter);
    });
  });

  addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    const date = document.getElementById("date-input").value;
    const time = document.getElementById("time-input").value;
    const priority = document.getElementById("priority").value || 'low';
    const recurring = document.getElementById("recurring")?.value || 'none';
    const section = document.getElementById("task-section").value;

    if (text !== "") {
      createTask(text, false, date, time, priority, recurring, section);
      saveTask(text, false, date, time, priority, recurring, section);
      // Reset fields here...
    }
      input.value = "";
      document.getElementById("date-input").value = "";
      document.getElementById("time-input").value = "";
      document.getElementById("priority").value = "low";
      document.getElementById("recurring").value = "none";
      updateStats();
    }
  );
  
    if (text !== "") {
      createTask(text, false, date, time);
      saveTask(text, false, date, time);
      input.value = "";
      document.getElementById("date-input").value = "";
      document.getElementById("time-input").value = "";
    }

    function createTask(text, completed = false, date = '', time = '', priority = 'low', recurring = 'none', section = 'General') {
        const li = document.createElement("li");
        if (completed) li.classList.add("completed");
        const sectionTag = document.createElement("div");
sectionTag.className = "task-section-label";
sectionTag.textContent = section;
      
        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = text;
      
        const meta = document.createElement("small");
        meta.className = "task-meta";
        if (date || time) meta.textContent = `Due: ${date} ${time}`;
      
        const priorityTag = document.createElement("span");
        priorityTag.className = `priority-tag ${priority}`;
        priorityTag.innerHTML = '<span class="dot"></span>';
      
        const recur = document.createElement("small");
        recur.className = "task-recurring";
        if (recurring !== 'none') recur.textContent = `⟳ ${recurring}`;
      
        const actions = document.createElement("div");
        actions.className = "task-actions";
      
        const checkBtn = document.createElement("button");
        checkBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
        checkBtn.onclick = () => {
          li.classList.toggle("completed");
          updateStorage();
          updateStats();
        };
      
        const delBtn = document.createElement("button");
        delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        delBtn.onclick = () => {
          li.remove();
          updateStorage();
          updateStats();
        };
      
        actions.append(checkBtn, delBtn);
        li.append(sectionTag, span, priorityTag, meta, recur, actions);
        list.appendChild(li);
      }

      function saveTask(text, completed, date, time, priority, recurring, section) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ text, completed, date, time, priority, recurring, section });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateStats();
      }
  
  function updateStorage() {
    const allTasks = document.querySelectorAll("li");
    const tasks = [...allTasks].map(li => ({
      text: li.querySelector(".task-text").textContent,
      completed: li.classList.contains("completed"),
      date: li.querySelector(".task-meta")?.textContent?.split(' ')[1] || '',
      time: li.querySelector(".task-meta")?.textContent?.split(' ')[2] || ''
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  function applyFilter(filter) {
    const tasks = document.querySelectorAll("li");
  
    tasks.forEach(task => {
      const isCompleted = task.classList.contains("completed");
      const date = task.querySelector(".task-meta")?.textContent?.split(" ")[1] || '';
      const priority = task.querySelector(".priority-tag")?.classList[1] || 'low';
      const today = new Date().toISOString().split('T')[0];
  
      task.style.display = "flex"; // reset
  
      if (filter === "completed" && !isCompleted) {
        task.style.display = "none";
      }
      else if (filter === "today" && date !== today) {
        task.style.display = "none";
      }
      else if (filter === "high" && priority !== "high") {
        task.style.display = "none";
      }
    });
  }
  setInterval(checkReminders, 60000); // every minute

function checkReminders() {
  const now = new Date();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach(task => {
    if (!task.completed && task.date && task.time) {
      const taskDateTime = new Date(`${task.date}T${task.time}`);
      const diff = taskDateTime - now;

      if (diff > 0 && diff < 60000) {
        // Trigger notification
        new Notification("⏰ Task Reminder", {
          body: `${task.text} is due now!`,
        });
      }
    }
  });
}
function updateStats() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const today = new Date().toISOString().split("T")[0];
    let completed = 0, todayCount = 0;
  
    tasks.forEach(task => {
      if (task.completed) completed++;
      if (task.date === today) todayCount++;
    });
  
    document.getElementById("stat-total").textContent = tasks.length;
    document.getElementById("stat-today").textContent = todayCount;
    document.getElementById("stat-completed").textContent = completed;
  }
//import data from "../data/calendar.json"; // replace with actual path or prop

export default function CalenderComponent({personTasks}) {
  const tasks = personTasks.tasks || [];

  return (
    <div className="glass-card w-full h-full">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-white/70 italic">No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((item, index) => (
            <li key={index} className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm text-white/80">
                <span className="font-semibold text-white">{item.person}:</span>{" "}
                {item.task}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

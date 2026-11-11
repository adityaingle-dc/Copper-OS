import { X } from "lucide-react"
import { playCopperChime, playStampSound, triggerConfetti } from "../../utils/delights"

function FrameWallModal({ isOpen, onClose, projects, onUpdateProject, isNight }) {
  if (!isOpen) return null

  const stages = ["Concept", "In Progress", "In Review", "Delivered"]

  const handleStageChange = (project, newStage) => {
    let newFill = 20
    let newStamp = "CONCEPT"

    if (newStage === "In Progress") {
      newFill = 55
      newStamp = "IN PROGRESS"
    } else if (newStage === "In Review") {
      newFill = 80
      newStamp = "IN REVIEW"
    } else if (newStage === "Delivered") {
      newFill = 100
      newStamp = "DELIVERED"
      playCopperChime()
      triggerConfetti()
    } else {
      playStampSound()
    }

    onUpdateProject({
      ...project,
      stage: newStage,
      fill: newFill,
      stamp: newStamp,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-4xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${isNight ? "bg-stone-900 border-stone-700 text-stone-100" : "bg-white border-stone-200 text-stone-800"
          }`}
        role="dialog"
        aria-labelledby="frame-wall-title"
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-[#FBF9F5]"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A96C4B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🖼️
            </div>
            <div>
              <h2 id="frame-wall-title" className="text-xl font-bold tracking-tight">
                The Frame Wall · Projects
              </h2>
              <p className="text-xs text-stone-400">
                Visual progress gallery. Drag or switch stages to watch frames fill.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors dark:hover:bg-stone-800 dark:hover:text-stone-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Studio Gallery Wall */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Gallery Shelf / Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stages.map((stg) => {
              const stageProjects = projects.filter((p) => p.stage === stg)
              return (
                <div
                  key={stg}
                  className={`p-4 rounded-xl border flex flex-col min-h-[360px] ${isNight ? "bg-stone-800/40 border-stone-800" : "bg-stone-50 border-stone-200/80"
                    }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const projId = e.dataTransfer.getData("text/plain")
                    const proj = projects.find((p) => p.id === projId)
                    if (proj && proj.stage !== stg) {
                      handleStageChange(proj, stg)
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200/60 dark:border-stone-700">
                    <span className="text-xs font-bold tracking-wider uppercase text-stone-500">
                      {stg}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200/60 dark:bg-stone-700 font-semibold text-stone-600 dark:text-stone-300">
                      {stageProjects.length}
                    </span>
                  </div>

                  <div className="space-y-4 flex-1">
                    {stageProjects.map((proj) => (
                      <div
                        key={proj.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", proj.id)
                        }}
                        className={`group relative p-3.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing hover:shadow-md ${isNight
                          ? "bg-stone-900 border-stone-700 hover:border-amber-500"
                          : "bg-white border-stone-200 hover:border-[#A96C4B]"
                          }`}
                      >
                        {/* Stamp Badge */}
                        <div
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-black tracking-widest border transform rotate-2 ${proj.stamp === "DELIVERED"
                            ? "bg-green-100 border-green-600 text-green-700 dark:bg-green-950 dark:border-green-400 dark:text-green-300"
                            : proj.stamp === "IN REVIEW"
                              ? "bg-amber-100 border-amber-600 text-amber-700 dark:bg-amber-950 dark:border-amber-400 dark:text-amber-300"
                              : "bg-stone-100 border-stone-400 text-stone-600 dark:bg-stone-800 dark:border-stone-500 dark:text-stone-300"
                            }`}
                        >
                          {proj.stamp}
                        </div>

                        {/* Visual Artwork / Frame Preview */}
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-stone-300/60 relative mb-3 bg-stone-100 dark:bg-stone-800">
                          <div
                            className="w-full h-full opacity-60"
                            style={{ background: proj.thumbnail }}
                          />

                          {/* Visual Fill Level */}
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-[#A96C4B]/80 backdrop-blur-xs transition-all duration-500 flex items-center justify-center"
                            style={{ height: `${proj.fill}%` }}
                          >
                            <span className="text-[11px] font-bold text-white drop-shadow">
                              {proj.fill}% Visual Fill
                            </span>
                          </div>
                        </div>

                        <h3 className="font-bold text-sm tracking-tight">{proj.title}</h3>
                        <p className="text-xs text-stone-400 mb-2">{proj.client}</p>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-800 text-stone-500">
                          <span className="font-semibold text-[#A96C4B]">{proj.budget}</span>
                          <span>Due: {proj.dueDate}</span>
                        </div>

                        {/* Quick stage controls */}
                        <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {stages.map((targetStage) => (
                            <button
                              key={targetStage}
                              onClick={() => handleStageChange(proj, targetStage)}
                              className={`flex-1 text-[10px] py-1 rounded font-medium border ${proj.stage === targetStage
                                ? "bg-[#A96C4B] text-white border-[#A96C4B]"
                                : "border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                                }`}
                            >
                              {targetStage.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs text-stone-500 ${isNight ? "border-stone-800 bg-stone-950/40" : "border-stone-100 bg-stone-50"
            }`}
        >
          <span>Tip: Drag project cards between stage columns to trigger stamps & chimes.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#A96C4B] text-white font-medium hover:bg-[#8D583B] transition-colors"
          >
            Back to Studio Floor
          </button>
        </div>
      </div>
    </div>
  )
}

export default FrameWallModal

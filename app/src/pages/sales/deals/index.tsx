import { useState } from "react"
import { Link } from "react-router-dom"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"

interface Task {
    id: string;
    title: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    clientName: string;
    assignee: {
        name: string;
    };
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

const initialKanbanData: Column[] = [
    {
        id: "todo",
        title: "To Do",
        tasks: [
            { id: "1", title: "New Inbound Lead", priority: "High", dueDate: "15 Mar", clientName: "PT. Maju Jaya", assignee: { name: "Budi Santoso" } },
            { id: "2", title: "Research Prospect Options", priority: "Medium", dueDate: "20 Mar", clientName: "Global Chem", assignee: { name: "Siti Rahmawati" } },
            { id: "3", title: "Update Contact Info", priority: "Low", dueDate: "22 Mar", clientName: "Plaza Property", assignee: { name: "Joko Anwar" } },
        ]
    },
    {
        id: "follow-up",
        title: "Follow Up",
        tasks: [
            { id: "4", title: "Call to discuss requirements", priority: "High", dueDate: "18 Mar", clientName: "XYZ Corp", assignee: { name: "Rina Kusuma" } },
            { id: "5", title: "Send Company Profile", priority: "Medium", dueDate: "14 Mar", clientName: "CV. Abadi", assignee: { name: "Budi Santoso" } },
            { id: "6", title: "Check on Email Sent Mon", priority: "Low", dueDate: "30 Mar", clientName: "Surya Indo", assignee: { name: "Dewi Lestari" } },
        ]
    },
    {
        id: "demo",
        title: "Demo",
        tasks: [
            { id: "7", title: "Product Demo Presentation", priority: "Medium", dueDate: "25 Mar", clientName: "Delta Corp", assignee: { name: "Siti Rahmawati" } },
            { id: "8", title: "Technical Showcase", priority: "High", dueDate: "16 Mar", clientName: "Global Chem", assignee: { name: "Joko Anwar" } },
        ]
    },
    {
        id: "quotation",
        title: "Quotation",
        tasks: [
            { id: "9", title: "Draft Proposal & Pricing", priority: "High", dueDate: "13 Mar", clientName: "Maju Jaya", assignee: { name: "Joko Anwar" } },
            { id: "10", title: "Calculate Bulk Discount", priority: "Medium", dueDate: "14 Mar", clientName: "Plaza Property", assignee: { name: "Rina Kusuma" } },
        ]
    },
    {
        id: "negotiation",
        title: "Negotiation",
        tasks: [
            { id: "11", title: "Review Contract Terms", priority: "Low", dueDate: "20 Mar", clientName: "Delta Corp", assignee: { name: "Dewi Lestari" } },
            { id: "12", title: "Counter offer review", priority: "High", dueDate: "12 Mar", clientName: "CV. Abadi", assignee: { name: "Budi Santoso" } },
        ]
    },
    {
        id: "po",
        title: "Purchase Order",
        tasks: [
            { id: "13", title: "Waiting for signed PO", priority: "Medium", dueDate: "19 Mar", clientName: "Surya Indo", assignee: { name: "Siti Rahmawati" } },
            { id: "14", title: "Process Invoice Payment", priority: "Low", dueDate: "18 Mar", clientName: "Global Logistics", assignee: { name: "Rina Kusuma" } },
        ]
    },
    {
        id: "closed",
        title: "Closed",
        tasks: [
            { id: "15", title: "Order Fulfilled", priority: "High", dueDate: "09 Mar", clientName: "PT Sentosa", assignee: { name: "Siti Rahmawati" } },
        ]
    }
]

export default function DealsPage() {
    const [kanbanData, setKanbanData] = useState<Column[]>(initialKanbanData)

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceColIndex = kanbanData.findIndex(col => col.id === source.droppableId);
        const destColIndex = kanbanData.findIndex(col => col.id === destination.droppableId);

        if (sourceColIndex === -1 || destColIndex === -1) return;

        const sourceCol = kanbanData[sourceColIndex];
        const destCol = kanbanData[destColIndex];

        const sourceTasks = [...sourceCol.tasks];
        const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destCol.tasks];

        const [removed] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, removed);

        const newKanbanData = [...kanbanData];
        newKanbanData[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
        newKanbanData[destColIndex] = { ...destCol, tasks: destTasks };

        setKanbanData(newKanbanData);
    };

    const getColumnTheme = (columnId: string) => {
        switch (columnId) {
            case "todo": return {
                bg: "bg-slate-100/60 border-slate-200/60",
                text: "text-slate-800",
                badge: "bg-slate-200 text-slate-700 border-none"
            };
            case "follow-up": return {
                bg: "bg-blue-50/60 border-blue-200/60",
                text: "text-blue-800",
                badge: "bg-blue-200/70 text-blue-800 border-none"
            };
            case "demo": return {
                bg: "bg-purple-50/60 border-purple-200/60",
                text: "text-purple-800",
                badge: "bg-purple-200/70 text-purple-800 border-none"
            };
            case "quotation": return {
                bg: "bg-amber-50/60 border-amber-200/60",
                text: "text-amber-800",
                badge: "bg-amber-200/70 text-amber-800 border-none"
            };
            case "negotiation": return {
                bg: "bg-orange-50/60 border-orange-200/60",
                text: "text-orange-800",
                badge: "bg-orange-200/70 text-orange-800 border-none"
            };
            case "po": return {
                bg: "bg-cyan-50/60 border-cyan-200/60",
                text: "text-cyan-800",
                badge: "bg-cyan-200/70 text-cyan-800 border-none"
            };
            case "closed": return {
                bg: "bg-emerald-50/60 border-emerald-200/60",
                text: "text-emerald-800",
                badge: "bg-emerald-200/70 text-emerald-800 border-none"
            };
            default: return {
                bg: "bg-slate-100/60 border-slate-200/60",
                text: "text-slate-800",
                badge: "bg-slate-200 text-slate-700 border-none"
            };
        }
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-700 w-full min-w-0">
            {/* Page Header */}
            <div className="flex items-center justify-between px-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Deals Board</h1>
                <Link
                    to="/deals/create"
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                    )}
                >
                    Create Deal
                </Link>
            </div>
            {/* Kanban Board Area */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 w-full min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar relative z-0 mt-4">
                    <div className="flex gap-6 pb-6 h-full min-h-0 w-max items-start px-0.5">
                        {kanbanData.map((column) => {
                            const theme = getColumnTheme(column.id);
                            return (
                                <div key={column.id} className={`w-80 flex flex-col gap-3 h-full min-h-0 ${theme.bg} border rounded-[1.25rem] p-3 shadow-sm`}>
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between px-1 shrink-0 pb-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`text-[15px] font-bold ${theme.text}`}>{column.title}</h3>
                                            <Badge variant="secondary" className={`rounded-full h-5 px-2 text-[10px] font-bold shadow-sm ${theme.badge}`}>
                                                {column.tasks.length}
                                            </Badge>
                                        </div>
                                        <Button variant="ghost" size="icon" className={`size-8 hover:bg-white/50 text-slate-400 hover:${theme.text} rounded-lg transition-colors`}>
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </div>

                                    {/* Droppable Area */}
                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`flex flex-col gap-3 h-full overflow-y-auto px-1 pb-2 rounded-xl transition-colors no-scrollbar ${snapshot.isDraggingOver ? "bg-primary/5 ring-1 ring-inset ring-primary/20" : ""
                                                    }`}
                                            >
                                                {column.tasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    opacity: snapshot.isDragging ? 0.9 : 1,
                                                                    zIndex: snapshot.isDragging ? 10 : 1,
                                                                }}
                                                            >
                                                                <Card
                                                                    className={`border-none transition-all duration-300 group cursor-grab active:cursor-grabbing rounded-xl overflow-hidden ${snapshot.isDragging ? "shadow-2xl shadow-primary/20 ring-2 ring-primary bg-white scale-105" : "shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-white"
                                                                        }`}
                                                                >
                                                                    <CardContent className="p-3">
                                                                        <div className="space-y-3">
                                                                            <div className="flex justify-between items-start">
                                                                                <h4 className="text-sm font-bold text-slate-900 leading-snug transition-colors pr-2">
                                                                                    <Link 
                                                                                        to={`/deals/${task.id}`} 
                                                                                        state={{ title: task.title }}
                                                                                        className="hover:text-primary transition-colors cursor-pointer"
                                                                                    >
                                                                                        {task.title}
                                                                                    </Link>
                                                                                </h4>
                                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                                    <MoreHorizontal className="size-4 text-slate-400 cursor-pointer hover:text-primary" />
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex flex-col gap-1.5">
                                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                                    <Badge
                                                                                        className={`text-[10px] font-semibold h-5 px-1.5 rounded border-none ${task.priority === "High" ? "bg-red-50 text-red-600" :
                                                                                            task.priority === "Medium" ? "bg-amber-50 text-amber-600" :
                                                                                                "bg-emerald-50 text-emerald-600"
                                                                                            }`}
                                                                                    >
                                                                                        {task.priority}
                                                                                    </Badge>
                                                                                    <span className="text-slate-500 font-semibold text-[10px]">{task.dueDate}</span>
                                                                                </div>
                                                                                <div className="flex flex-col gap-0.5">
                                                                                    <span className="font-semibold text-xs text-slate-700">{task.clientName}</span>
                                                                                    <span className="text-[11px] text-slate-500 font-medium">
                                                                                        {task.assignee.name}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </DragDropContext>
        </div>
    )
}

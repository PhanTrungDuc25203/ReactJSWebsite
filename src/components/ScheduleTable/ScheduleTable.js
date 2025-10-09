import React, { useEffect, useState } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";
import "./ScheduleTable.scss";

function ScheduleTable({ events = [], defaultView = "week" }) {
    const [selectedEvent, setSelectedEvent] = useState(null); // event đang được chọn
    const [eventsService] = useState(() => createEventsServicePlugin());

    // Tạo lịch
    const calendar = useCalendarApp({
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        events,
        defaultView,
        plugins: [eventsService],
        callbacks: {
            onEventClick: (event) => {
                setSelectedEvent(event);
            },
        },
    });

    // In ra event để debug
    useEffect(() => {
        console.log("📅 Tất cả lịch:", eventsService.getAll());
    }, [eventsService]);

    return (
        <div className="schedule-table-container">
            <ScheduleXCalendar calendarApp={calendar} />

            {/* Modal chi tiết event */}
            {selectedEvent && (
                <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
                    <div className="event-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedEvent.title}</h3>
                        <p>
                            <strong>Bắt đầu:</strong> {selectedEvent.start.toString().replace("T", " ").split("[")[0]}
                        </p>
                        <p>
                            <strong>Kết thúc:</strong> {selectedEvent.end.toString().replace("T", " ").split("[")[0]}
                        </p>
                        {selectedEvent.description && (
                            <p>
                                <strong>Ghi chú:</strong> {selectedEvent.description}
                            </p>
                        )}
                        <button className="close-btn" onClick={() => setSelectedEvent(null)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScheduleTable;

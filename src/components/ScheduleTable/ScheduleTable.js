/* global Temporal */
import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";
import "./ScheduleTable.scss";

const ScheduleTable = forwardRef(({ events = [], defaultView = "week" }, ref) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventsService] = useState(() => createEventsServicePlugin());
    const [calendarControls] = useState(() => createCalendarControlsPlugin());

    const calendar = useCalendarApp({
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        defaultView,
        plugins: [eventsService, calendarControls],
        events,
        calendars: {
            past: {
                colorName: "past",
                lightColors: {
                    main: "#c0c0c0",
                    container: "#eeeeee",
                    onContainer: "#333333",
                },
            },
            soon: {
                colorName: "soon",
                lightColors: {
                    main: "#ff9800",
                    container: "#ffe0b2",
                    onContainer: "#4a2500",
                },
            },
            future: {
                colorName: "future",
                lightColors: {
                    main: "#2196f3",
                    container: "#bbdefb",
                    onContainer: "#002f6c",
                },
            },
        },
        callbacks: {
            onEventClick: (event) => setSelectedEvent(event),
        },
    });

    useImperativeHandle(ref, () => ({
        goToDate(dateStr) {
            try {
                const plainDate = Temporal.PlainDate.from(dateStr);
                calendarControls.setDate(plainDate);
            } catch (err) {
                console.error("Invalid date for calendarControls.setDate:", err);
            }
        },

        // ⭐ MỚI: đi đến đúng giờ của event
        goToEvent(event, dateStr) {
            try {
                const plainDate = Temporal.PlainDate.from(dateStr);
                calendarControls.setDate(plainDate);

                // đợi lịch render
                setTimeout(() => {
                    const hour = event.start.hour;

                    const timeGrid = document.querySelector(".sx__view-container ");
                    console.log("Check component: ", timeGrid);
                    if (!timeGrid) return;

                    const cellHeight = 60; // mỗi giờ cao ~60px (tuỳ theme)
                    const scrollY = hour * cellHeight - 80; // cuộn lên chút cho dễ nhìn

                    timeGrid.scrollTop = scrollY;
                }, 150);
            } catch (err) {
                console.error("Error goToEvent:", err);
            }
        },
    }));

    useEffect(() => {
        if (!events) return;
        if (Array.isArray(events) && events.length > 0) {
            eventsService.set(events);
        } else {
            eventsService.set([]);
        }
    }, [events, eventsService]);

    return (
        <div className="schedule-table-container">
            <ScheduleXCalendar calendarApp={calendar} />
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
                        {selectedEvent.location && (
                            <p>
                                <strong>Địa chỉ khám:</strong> {selectedEvent.location}
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
});

export default ScheduleTable;

import React, { Component } from "react";
import { connect } from "react-redux";
import "./ScheduleAndTimetableManage.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, dateFormat } from "../../../utils";
import { getDoctorScheduleByDateService } from "../../../services/userService";
import Select from "react-select";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";

class ScheduleAndTimetableManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            selectedDay: new Date().setHours(0, 0, 0, 0),
            timeframe: [],
            existingSchedules: [], // Lưu lịch đã tạo từ DB
            bookedSchedules: [], // Lưu lịch đã có bệnh nhân đặt
            schedulesToDelete: [], // Lưu các lịch cần xóa
            showConfirmModal: false,
            pendingDeleteSchedule: null, // Lưu lịch đang chờ xác nhận xóa
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctorsForDoctorArticlePage();
        this.props.fetchHoursInAllcodesForScheduleManagePage();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctorsForDoctorArticlePage !== this.props.allDoctorsForDoctorArticlePage) {
            let selectData = this.buildDataForDoctorSelectBox(this.props.allDoctorsForDoctorArticlePage);
            this.setState({
                listDoctors: selectData,
            });
        }
        if (prevProps.examHoursData !== this.props.examHoursData) {
            let data = this.props.examHoursData;
            if (data && data.length > 0) {
                data = data.map((item) => ({ ...item, isSelected: false, isBooked: false, isExisting: false }));
            }
            this.setState({
                timeframe: data,
            });
        }

        // Khi thay đổi bác sĩ hoặc ngày, load lại lịch đã tồn tại
        if ((prevState.selectedDoctor !== this.state.selectedDoctor && !_.isEmpty(this.state.selectedDoctor)) || prevState.selectedDay !== this.state.selectedDay) {
            this.loadExistingSchedules();
        }
    }

    buildDataForDoctorSelectBox = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item, index) => {
                let tempObj = {};
                let labelInVie = `${item.lastName} ${item.firstName}`;
                let labelInEng = `${item.firstName} ${item.lastName}`;
                tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
                tempObj.value = item.id;
                result.push(tempObj);
            });
        }
        return result;
    };

    handleChangeOnSelectBox = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor }, () => {
            if (!_.isEmpty(selectedDoctor)) {
                this.loadExistingSchedules();
            }
        });
    };

    handleDatePickerChanged = (date) => {
        this.setState({
            selectedDay: date[0],
        });
    };

    // Load lịch đã tồn tại từ database
    loadExistingSchedules = async () => {
        let { selectedDoctor, selectedDay, timeframe } = this.state;

        if (!selectedDoctor || _.isEmpty(selectedDoctor) || !selectedDay) {
            return;
        }

        // Nếu timeframe chưa load thì chờ
        if (!timeframe || timeframe.length === 0) {
            return;
        }

        try {
            let formatedDate = new Date(selectedDay).getTime();
            let response = await getDoctorScheduleByDateService(selectedDoctor.value, formatedDate);

            console.log("Response from API:", response); // Debug

            if (response && response.errCode === 0) {
                let existingSchedules = response.data || [];
                let bookedSchedules = response.bookedSchedule || [];

                console.log("Existing schedules:", existingSchedules); // Debug
                console.log("Booked schedules:", bookedSchedules); // Debug

                // Cập nhật timeframe với trạng thái từ DB
                if (timeframe && timeframe.length > 0) {
                    let updatedTimeframe = timeframe.map((item) => {
                        // Kiểm tra xem khung giờ này có trong lịch đã tạo không
                        let existingSchedule = existingSchedules.find((schedule) => schedule.timeType === item.keyMap);

                        // Đếm số lượng bệnh nhân đã đặt cho khung giờ này
                        let bookingsForThisTime = bookedSchedules.filter((booking) => booking.timeType === item.keyMap);
                        let currentNumberBooked = bookingsForThisTime.length;
                        let hasBookings = currentNumberBooked > 0;

                        return {
                            ...item,
                            isExisting: !!existingSchedule,
                            isSelected: !!existingSchedule,
                            isBooked: hasBookings,
                            currentNumberBooked: currentNumberBooked,
                            maxNumber: existingSchedule ? existingSchedule.maxNumber : 0,
                        };
                    });

                    console.log("Updated timeframe:", updatedTimeframe); // Debug

                    this.setState({
                        timeframe: updatedTimeframe,
                        existingSchedules: existingSchedules,
                        bookedSchedules: bookedSchedules,
                        schedulesToDelete: [],
                    });
                }
            }
        } catch (error) {
            console.error("Error loading existing schedules:", error);
            toast.error("Không thể tải lịch khám hiện tại!");
        }
    };

    handleTimeFrameClicked = (time) => {
        let { timeframe, schedulesToDelete } = this.state;

        if (timeframe && timeframe.length > 0) {
            // Nếu khung giờ đã tồn tại trong DB
            if (time.isExisting) {
                // Nếu có bệnh nhân đặt lịch -> hiện popup xác nhận
                if (time.isBooked) {
                    this.setState({
                        showConfirmModal: true,
                        pendingDeleteSchedule: time,
                    });
                    return;
                } else {
                    // Chưa có bệnh nhân đặt -> toggle trạng thái và thêm vào danh sách xóa
                    timeframe = timeframe.map((item) => {
                        if (item.id === time.id) {
                            item.isSelected = !item.isSelected;

                            // Nếu bỏ chọn thì thêm vào danh sách xóa
                            if (!item.isSelected) {
                                if (!schedulesToDelete.includes(item.keyMap)) {
                                    schedulesToDelete.push(item.keyMap);
                                }
                            } else {
                                // Nếu chọn lại thì xóa khỏi danh sách xóa
                                schedulesToDelete = schedulesToDelete.filter((keyMap) => keyMap !== item.keyMap);
                            }
                        }
                        return item;
                    });
                }
            } else {
                // Khung giờ mới -> toggle bình thường
                timeframe = timeframe.map((item) => {
                    if (item.id === time.id) {
                        item.isSelected = !item.isSelected;
                    }
                    return item;
                });
            }

            this.setState({
                timeframe: timeframe,
                schedulesToDelete: schedulesToDelete,
            });
        }
    };

    // Xác nhận xóa lịch có bệnh nhân
    handleConfirmDelete = () => {
        let { timeframe, schedulesToDelete, pendingDeleteSchedule } = this.state;

        if (pendingDeleteSchedule) {
            timeframe = timeframe.map((item) => {
                if (item.id === pendingDeleteSchedule.id) {
                    item.isSelected = false;
                    if (!schedulesToDelete.includes(item.keyMap)) {
                        schedulesToDelete.push(item.keyMap);
                    }
                }
                return item;
            });

            this.setState({
                timeframe: timeframe,
                schedulesToDelete: schedulesToDelete,
                showConfirmModal: false,
                pendingDeleteSchedule: null,
            });
        }
    };

    // Hủy xóa lịch
    handleCancelDelete = () => {
        this.setState({
            showConfirmModal: false,
            pendingDeleteSchedule: null,
        });
    };

    handleSaveScheduleButtonClicked = async () => {
        let { timeframe, selectedDoctor, selectedDay, schedulesToDelete, bookedSchedules } = this.state;
        let result = [];

        if (!selectedDay) {
            toast.error("Vui lòng chọn ngày khám!");
            return;
        }

        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Vui lòng chọn bác sĩ!");
            return;
        }

        let formatedDate = new Date(selectedDay).getTime();

        // Lấy các khung giờ được chọn (mới thêm hoặc giữ lại)
        if (timeframe && timeframe.length > 0) {
            let selectedTimeTemp = timeframe.filter((item) => item.isSelected === true);
            if (selectedTimeTemp && selectedTimeTemp.length > 0) {
                selectedTimeTemp.map((schedule, index) => {
                    let object = {};
                    object.date = formatedDate;
                    object.doctorId = selectedDoctor.value;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                });
            }
        }

        // Chuẩn bị dữ liệu để gửi lên backend
        let dataToSend = {
            scheduleArr: result,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate,
            schedulesToDelete: schedulesToDelete, // Danh sách các khung giờ cần xóa
        };

        // Kiểm tra xem có khung giờ nào cần gửi email không
        let schedulesWithPatients = schedulesToDelete
            .map((timeType) => {
                let bookingsForThisTime = bookedSchedules.filter((booking) => booking.timeType === timeType);
                return bookingsForThisTime;
            })
            .flat()
            .filter((item) => item !== undefined);

        if (schedulesWithPatients && schedulesWithPatients.length > 0) {
            dataToSend.schedulesWithPatients = schedulesWithPatients;
        }

        console.log("Data to send:", dataToSend); // Debug

        // Gọi action để lưu
        this.props.createTimeframesForDoctorSchedule(dataToSend);

        toast.success("Đang lưu lịch khám...");

        // Reload lại lịch sau khi lưu
        setTimeout(() => {
            this.loadExistingSchedules();
        }, 1000);
    };

    checkIfThisDoctorIsInDoctorList = (thisDoctor, doctorList) => {
        let foundDoctor = doctorList.find((doctor) => doctor.label === thisDoctor);

        if (foundDoctor) {
            return [
                {
                    label: foundDoctor.label,
                    value: foundDoctor.value,
                },
            ];
        }

        return null;
    };

    render() {
        let { timeframe, showConfirmModal, pendingDeleteSchedule } = this.state;
        let { language, userInfo } = this.props;

        let tempObj = {};
        let labelInVie = `${userInfo.lastName} ${userInfo.firstName}`;
        let labelInEng = `${userInfo.firstName} ${userInfo.lastName}`;
        tempObj = language === LANGUAGES.VI ? labelInVie : labelInEng;
        let checkPresentInDoctorList = this.checkIfThisDoctorIsInDoctorList(tempObj, this.state.listDoctors);

        return (
            <div className="schedule-manage-page-container">
                <div className="schedule-page-title">
                    <FormattedMessage id="schedule-and-timetable-manage-page.title" />
                </div>
                <div className="content-container">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label>
                                    <FormattedMessage id="schedule-and-timetable-manage-page.choose-dotor" />
                                </label>
                                <Select value={this.state.selectedDoctor} onChange={this.handleChangeOnSelectBox} options={checkPresentInDoctorList ? checkPresentInDoctorList : this.state.listDoctors} placeholder="Chọn bác sĩ..." />
                            </div>
                            <div className="col-md-6 form-group">
                                <label>
                                    <FormattedMessage id="schedule-and-timetable-manage-page.choose-day" />
                                </label>
                                <DatePicker onChange={this.handleDatePickerChanged} className="form-control" value={this.state.selectedDay} minDate={new Date().setHours(0, 0, 0, 0)} />
                            </div>
                            <div className="col-md-12 choose-time-frame">
                                {timeframe &&
                                    timeframe.length > 0 &&
                                    timeframe.map((item, index) => {
                                        let buttonClass = "time-frame-button";

                                        // Nếu được chọn
                                        if (item.isSelected === true) {
                                            // Nếu có bệnh nhân đặt -> màu đỏ
                                            if (item.isBooked) {
                                                buttonClass += " booked";
                                            } else {
                                                // Chưa có bệnh nhân -> màu xanh
                                                buttonClass += " active";
                                            }
                                        }

                                        return (
                                            <button
                                                key={index}
                                                className={buttonClass}
                                                onClick={() => this.handleTimeFrameClicked(item)}
                                                title={item.isBooked ? `Đã có ${item.currentNumberBooked}/${item.maxNumber} bệnh nhân đặt lịch` : item.isExisting ? "Khung giờ đã tạo - Click để hủy" : "Click để chọn"}
                                            >
                                                {language === LANGUAGES.VI ? item.value_Vie : item.value_Eng}
                                                {item.isBooked && <span className="booking-count">{` (${item.currentNumberBooked}/${item.maxNumber})`}</span>}
                                            </button>
                                        );
                                    })}
                            </div>
                            <div className="col-md-10 spacing"></div>
                            <button className="save-button btn btn-primary" onClick={() => this.handleSaveScheduleButtonClicked()}>
                                <FormattedMessage id="schedule-and-timetable-manage-page.save-button" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                {showConfirmModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Xác nhận hủy lịch</h3>
                            <p>Khung giờ này đã có bệnh nhân đặt lịch. Bạn có chắc chắn muốn hủy không?</p>
                            <p className="warning-text">Hệ thống sẽ gửi email thông báo hủy lịch đến bệnh nhân.</p>
                            <div className="modal-buttons">
                                <button className="btn btn-secondary" onClick={this.handleCancelDelete}>
                                    Không
                                </button>
                                <button className="btn btn-danger" onClick={this.handleConfirmDelete}>
                                    Có, hủy lịch
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctorsForDoctorArticlePage: state.admin.allDoctorsForDoctorArticlePage,
        examHoursData: state.admin.examHoursData,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctorsForDoctorArticlePage: () => dispatch(actions.fetchAllDoctorsForDoctorArticlePage()),
        fetchHoursInAllcodesForScheduleManagePage: () => dispatch(actions.fetchHoursInAllcodesForScheduleManagePage()),
        createTimeframesForDoctorSchedule: (result) => dispatch(actions.createTimeframesForDoctorSchedule(result)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAndTimetableManage);

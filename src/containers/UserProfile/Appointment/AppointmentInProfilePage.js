import React, { PureComponent, Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import './AppointmentInProfilePage.scss';
import { withRouter } from 'react-router';
import * as actions from '../../../store/actions';
import moment from 'moment';

// Lazy load appointment components
const AppointmentItemForPatientInfterface = lazy(() => import('./AppointmentItemForPatientInfterface'));
const AppointmentItemForDoctorInfterface = lazy(() => import('./AppointmentItemForDoctorInfterface'));
const HistoryOfDoctorAppointment = lazy(() => import('./HistoryOfDoctorAppointment'));
const HistoryOfPatientAppointment = lazy(() => import('./HistoryOfPatientAppointment'));

class AppointmentInProfilePage extends PureComponent {
    state = {
        combinedAppointments: {},
        userRole: '',
        historyOrHandling: 'handling',
        currentUserEmail: '',
    };

    componentDidMount() {
        const { combinedAppointments, userRole, currentUserEmail } = this.props;
        if (combinedAppointments && userRole) {
            this.setState({ combinedAppointments, userRole, currentUserEmail });
        }
    }

    componentDidUpdate(prevProps) {
        const { combinedAppointments, userRole, currentUserEmail } = this.props;
        if (prevProps.combinedAppointments !== combinedAppointments || prevProps.userRole !== userRole || prevProps.currentUserEmail !== currentUserEmail) {
            this.setState({ combinedAppointments, userRole, currentUserEmail });
        }
    }

    handleHistoryOrHandlingButtonClicked = () => {
        this.setState(prevState => ({
            historyOrHandling: prevState.historyOrHandling === 'history' ? 'handling' : 'history',
        }));
    };

    renderAppointmentItems = (appointments, isDoctor) => {
        const { historyOrHandling, currentUserEmail } = this.state;
        console.log("Check props from parent: ", currentUserEmail);
        return (
            <div className="appointment-container">
                {historyOrHandling === 'handling' ? (
                    appointments.map((item, index) => (
                        item.statusId !== 'S3' && (
                            <div className="appointment-item" key={index}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    {isDoctor ? (
                                        <AppointmentItemForDoctorInfterface
                                            scheduleStatus={item.statusId}
                                            appointmentId={item.id}
                                            meetPatientId={item.patientId}
                                            appointmentDate={moment(item.date).format('DD-MM-YYYY')}
                                            appointmentTimeFrame={item.appointmentTimeTypeData?.value_Vie}
                                            patientBirthday={moment(item.patientBirthday).format('DD-MM-YYYY')}
                                        />
                                    ) : (
                                        <AppointmentItemForPatientInfterface
                                            scheduleStatus={item.statusId}
                                            appointmentId={item.id}
                                            meetDoctorId={item.doctorId}
                                            appointmentDate={moment(item.date).format('DD-MM-YYYY')}
                                            appointmentTimeFrame={item.appointmentTimeTypeData?.value_Vie}
                                        />
                                    )}
                                </Suspense>
                            </div>
                        )
                    ))
                ) : (
                    <Suspense fallback={<div>Loading...</div>}>
                        {isDoctor ? (
                            <HistoryOfDoctorAppointment
                                currentUserEmail={currentUserEmail}
                            />
                        ) : (
                            <HistoryOfPatientAppointment
                                currentUserEmail={currentUserEmail}
                            />
                        )}
                    </Suspense>
                )}
            </div>
        );
    };

    render() {
        const { combinedAppointments, userRole, historyOrHandling } = this.state;

        return (
            <div className="appointment-in-profile-page">
                <div className="appointment-in-profile-page-header">
                    <div className="appointment-in-profile-page-title">
                        Danh sách lịch hẹn đã đặt
                    </div>
                    <a
                        // href="#"
                        className={historyOrHandling === 'history' ? 'btn-flip-backward' : 'btn-flip'}
                        data-back={historyOrHandling === 'history' ? 'Chưa khám' : 'Lịch sử'}
                        data-front={historyOrHandling === 'history' ? 'Lịch sử' : 'Chưa khám'}
                        onClick={this.handleHistoryOrHandlingButtonClicked}
                    />
                </div>
                <div className="appointment-container">
                    {combinedAppointments.patientAppointments && combinedAppointments.patientAppointments.length > 0
                        ? this.renderAppointmentItems(combinedAppointments.patientAppointments, false)
                        : userRole === 'R3' && 'Bạn chưa có lịch hẹn nào với bác sĩ'}

                    {combinedAppointments.doctorAppointments && combinedAppointments.doctorAppointments.length > 0
                        ? this.renderAppointmentItems(combinedAppointments.doctorAppointments, true)
                        : userRole === 'R2' && 'Bạn chưa có lịch hẹn nào với bệnh nhân'}

                    {userRole === 'R1' && 'Bạn là admin nên không có gì trong này đâu:))'}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
});

const mapDispatchToProps = dispatch => ({
    processLogout: () => dispatch(actions.processLogout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentInProfilePage));

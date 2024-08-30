export const adminMenu = [
    { //quản lý người dùng
        name: 'menu.admin.menu-title-1', menus: [
            {
                name: 'menu.admin.user-CRUD', link: '/system/user-manage'
                // subMenus: [
                //     { name: 'menu.admin.user-manage-for-doctor', link: '/system/user-manage' },
                //     { name: 'menu.admin.user-manage-for-admin', link: '/system/user-manage-by-redux' },
                // ]
            },
            {
                name: 'menu.admin.user-CRUD-by-redux', link: '/system/user-manage-by-redux'
            },
            {
                name: 'menu.admin.doctor-manage', link: '/system/doctor-manage-by-redux'
            },
            // {
            //     name: 'menu.admin.admin-manage', link: '/system/user-manage-by-redux'
            // },
            { //quản lý kế hoạch khám bệnh của bác sĩ
                name: 'menu.doctor.schedule-and-timetable', link: '/doctor/schedule-manage'
            },
        ]
    },

    { //quản lý phòng khám
        name: 'menu.admin.menu-title-2', menus: [
            {
                name: 'menu.admin.clinic-manage', link: '/system/clinic-manage'
            },
        ]
    },

    { //quản lý chuyên khoa
        name: 'menu.admin.menu-title-3', menus: [
            {
                name: 'menu.admin.specialty-manage', link: '/system/specialty-manage'
            },
        ]
    },

    { //quản lý cẩm nang/bài đăng
        name: 'menu.admin.menu-title-4', menus: [
            {
                name: 'menu.admin.article-handbook-manage', link: '/system/article-handbook-manage'
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.manage-schedule-and-timetable',
        menus: [
            { //quản lý kế hoạch khám bệnh của bác sĩ
                name: 'menu.doctor.schedule-and-timetable',
                link: '/doctor/schedule-manage'
            },
        ]
    }
];
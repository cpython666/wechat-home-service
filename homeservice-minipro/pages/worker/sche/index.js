Page({
  data: {
    currentDate: '',
    schedules: [],
    tempSchedules: {}
  },
  onLoad: function () {
    var schedules = wx.getStorageSync('schedules') || [];
    console.log(schedules)
    // 确保每个时间段都有唯一的随机 ID
    schedules = schedules.map(schedule => {
      schedule.timeSlots = schedule.timeSlots.map(slot => ({
        ...slot,
        id: slot.id || this.generateId()
      }));
      return schedule;
    });
    console.log(schedules)
    const currentDate = this.formatDate(new Date());
    this.setData({ schedules, currentDate }, () => {
      console.log('页面数据已更新', this.data);
    });
  },
  formatDate: function (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  generateId: function () {
    return Math.random().toString(36).substr(2, 9);
  },
  onDateChange: function (e) {
    const currentDate = e.detail.value;
    const newSlots = [
      { id: this.generateId(), start: '09:00', end: '11:59', active: true },
      { id: this.generateId(), start: '14:00', end: '17:59', active: true }
    ];

    let schedules = this.data.schedules;
    const dateExists = schedules.some(schedule => schedule.date === currentDate);

    if (!dateExists) {
      schedules.push({ date: currentDate, timeSlots: newSlots });
    } else {
      schedules = schedules.map(schedule => {
        if (schedule.date === currentDate) {
          schedule.timeSlots = schedule.timeSlots.concat(newSlots);
          schedule.timeSlots.sort((a, b) => a.start.localeCompare(b.start));
        }
        return schedule;
      });
    }

    this.setData({ schedules, currentDate });
  },
  addTimeSlot: function (e) {
    const date = e.currentTarget.dataset.date || this.data.currentDate;
    const newSlot = { id: this.generateId(), start: '09:00', end: '11:59', active: true };
    const schedules = this.data.schedules.map(schedule => {
      if (schedule.date === date) {
        return { ...schedule, timeSlots: [...schedule.timeSlots, newSlot].sort((a, b) => a.start.localeCompare(b.start)) };
      }
      return schedule;
    });

    const dateExists = schedules.some(schedule => schedule.date === date);
    if (!dateExists) {
      schedules.push({ date: date, timeSlots: [newSlot] });
    }

    this.setData({ schedules });
  },
  removeTimeSlot: function (e) {
    const { date, id } = e.currentTarget.dataset;
    const schedules = this.data.schedules.map(schedule => {
      if (schedule.date === date) {
        return {
          ...schedule,
          timeSlots: schedule.timeSlots.filter(slot => slot.id !== id)
        };
      }
      return schedule;
    });
    this.setData({ schedules });
  },
  toggleSlotActive: function (e) {
    const { date, id } = e.currentTarget.dataset;
    console.log('toggleSlotActive: date =', date, 'id =', id);

    const schedules = this.data.schedules.map(schedule => {
      if (schedule.date === date) {
        return {
          ...schedule,
          timeSlots: schedule.timeSlots.map(slot => {
            if (slot.id === id) {
              return { ...slot, active: !slot.active };
            }
            return slot;
          })
        };
      }
      return schedule;
    });
    this.setData({ schedules }, () => {
      console.log('Switch state updated', this.data.schedules);
    });
  },
  onStartTimeInput: function (e) {
    const { date, id } = e.currentTarget.dataset;
    const value = e.detail.value;

    if (!this.data.tempSchedules[date]) {
      this.data.tempSchedules[date] = {};
    }
    if (!this.data.tempSchedules[date][id]) {
      this.data.tempSchedules[date][id] = {};
    }
    this.data.tempSchedules[date][id].start = value;
  },
  onEndTimeInput: function (e) {
    const { date, id } = e.currentTarget.dataset;
    const value = e.detail.value;

    if (!this.data.tempSchedules[date]) {
      this.data.tempSchedules[date] = {};
    }
    if (!this.data.tempSchedules[date][id]) {
      this.data.tempSchedules[date][id] = {};
    }
    this.data.tempSchedules[date][id].end = value;
  },
  saveSchedule: function () {
    const tempSchedules = this.data.tempSchedules;
    const schedules = this.data.schedules.map(schedule => {
      const date = schedule.date;
      if (tempSchedules[date]) {
        const timeSlots = schedule.timeSlots.map(slot => {
          const id = slot.id;
          if (tempSchedules[date][id]) {
            return {
              ...slot,
              start: tempSchedules[date][id].start || slot.start,
              end: tempSchedules[date][id].end || slot.end
            };
          }
          return slot;
        });
        return { ...schedule, timeSlots };
      }
      return schedule;
    });
    wx.setStorageSync('schedules', schedules);
    const worker = wx.getStorageSync('worker') || [];
    wx.request({
      url: `http://localhost:8000/save_schedule`,
      method: 'GET',
      data:{'schedules':schedules,'worker':worker.username},
      success: (response) => {
        wx.showToast({
          title: '排班信息已发送',
          icon: 'success'
        });

        // 返回首页或订单管理页面
        wx.navigateTo({
          url: '/pages/worker/index'
        });
      },
      fail: (error) => {
        console.log(error)
        wx.showToast({
          title: '发送排班信息失败',
          icon: 'none'
        });
      }
    });
  },
})

// pages/schedule/schedule.js
Page({
  data: {
      schedules: [],
      selectedDate: new Date().toISOString().slice(0, 10) // 默认选中今天
  },

  onLoad: function() {
      this.loadSchedules(); // 加载初始数据
  },

  onDateChange: function(e) {
      this.setData({
          selectedDate: e.detail.value
      });
      this.loadSchedulesForDate(e.detail.value); // 加载选定日期的排班数据
  },

  // 加载排班数据，模拟从服务器获取
  loadSchedules: function() {
      const mockData = [
          { id: 1, date: '2024-04-20', startTime: '09:00', endTime: '17:00', serviceType: '深度清洁', workerName: '张三' },
          // { id: 2, date: '2024-04-21', startTime: '10:00', endTime: '14:00', serviceType: '烹饪服务', workerName: '李四' }
      ];
      this.setData({ schedules: mockData });
  },

  // 根据选定日期加载排班数据
  loadSchedulesForDate: function(date) {
      const mockData = this.data.schedules.filter(schedule => schedule.date === date);
      this.setData({ schedules: mockData });
  },

  // 添加新的排班
  addSchedule: function() {
      // 这里可以添加弹出表单或跳转到新页面的逻辑
      console.log('Add schedule function triggered.');
  },

  // 编辑排班信息
  editSchedule: function(e) {
      const scheduleId = e.currentTarget.dataset.id;
      console.log('Edit schedule:', scheduleId);
  },

  // 删除排班
  deleteSchedule: function(e) {
      const scheduleId = e.currentTarget.dataset.id;
      console.log('Delete schedule:', scheduleId);
      const updatedSchedules = this.data.schedules.filter(item => item.id !== scheduleId);
      this.setData({ schedules: updatedSchedules });
  }
});

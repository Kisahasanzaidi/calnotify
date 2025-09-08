import React, { useContext, useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, Spin, Checkbox, message } from "antd";
import dayjs from "dayjs";
import { AuthContext } from "../context/AuthContext.tsx";
import { User } from "../api/type.ts";
import { getAllUsers } from "../api/user.ts";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (values: any) => void;
  selectedDate?: string;
}

const CreateEventModal: React.FC<Props> = ({ open, onClose, onCreate, selectedDate }) => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingUsers(true);
      getAllUsers()
        .then((users) => setAllUsers(users))
        .catch((err) => console.error(err))
        .finally(() => setLoadingUsers(false));

      if (selectedDate) {
        const date = dayjs(selectedDate);
        form.setFieldsValue({
          dates: [date.startOf("day"), date.startOf("day").add(1, "hour")],
        });
      }
    }
  }, [open, selectedDate]);

  const handleFinish = (values: any) => {
    const [start, end] = values.dates;
    const payload = {
      event: {
        title: values.title,
        description: values.description,
        start: start.toISOString() || "",
        end: end.toISOString() || "",
        createdBy: auth?.userId,
        allDay,
      },
      participants: values.participants,
    };
    onCreate(payload);
    form.resetFields();
    setAllDay(false);
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Create Event">
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Event Title"
          name="title"
          rules={[{ required: true, message: "Please enter the event title" }]}
        >
          <Input placeholder="Enter event title" />
        </Form.Item>

        <Form.Item label="Event Description" name="description">
          <Input.TextArea placeholder="Enter event description" />
        </Form.Item>

        <Form.Item
          label="Guests"
          name="participants"
          rules={[{ required: true, message: "Please select at least one guest" }]}
        >
          {loadingUsers ? (
            <Spin />
          ) : (
            <Select
              mode="multiple"
              placeholder="Select guests"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as any).toLowerCase().includes(input.toLowerCase())
              }
            >
              {allUsers
                .filter((user) => user.userId !== auth?.userId)
                .map((user) => (
                  <Option key={user.userId} value={user.userId}>
                    {user.name} ({user.email})
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          <Checkbox checked={allDay} onChange={(e) => setAllDay(e.target.checked)}>
            All Day
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="Start and End"
          name="dates"
          rules={[{ required: true, message: "Please select date & time" }]}
        >
          <RangePicker
            showTime={!allDay ? { format: "HH:mm" } : false}
            format={allDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
            className="w-full"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Create Event
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEventModal;

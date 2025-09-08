import { Button, Form, Input, Modal, DatePicker, Space, message } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import dayjs from "dayjs";

interface EventDetailsProps {
  open: boolean;
  onClose: () => void;
  event: any; 
  onSave: (values: any) => void;
  onDelete: (id: string) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  open,
  onClose,
  event,
  onSave,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...values, id: event.id });
      message.success("Event updated");
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        setEditMode(false);
        onClose();
      }}
      footer={null}
      title={editMode ? "Edit Event" : "Event Details"}
    >
      {editMode ? (
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            title: event.title,
            description: event.description,
            dates: [dayjs(event.start), dayjs(event.end)],
            
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Dates" name="dates" rules={[{ required: true }]}>
            <DatePicker.RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Space>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              onClick={handleSave}
            >
              Save
            </Button>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
          </Space>
        </Form>
      ) : (
        <div>
          <p><strong>Title:</strong> {event.title}</p>
          <p><strong>Start:</strong> {dayjs(event.start).format("YYYY-MM-DD HH:mm")}</p>
          <p><strong>End:</strong> {dayjs(event.end).format("YYYY-MM-DD HH:mm")}</p>
          <p><strong>Description:</strong> {event.description || "No description"}</p>
          <p><strong>Organizer:</strong> {event.organizer || "Unknown"}</p> 

          <Space style={{ marginTop: 16 }}>
            <Button icon={<EditOutlined />} onClick={() => setEditMode(true)}>
              Edit
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(event.id)}
            >
              Delete
            </Button>
          </Space>
        </div>
      )}
    </Modal>
  );
};

export default EventDetails;

import { Form, Input, Button, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function LoginForm() {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className='w-3/4'>
      <h1 className='font-bold text-center mb-3 text-2xl'>Login</h1>
      <Form
        onFinish={onFinish}
        initialValues={{ campus: 'hn' }}
      >
        <Form.Item
          name="campus"
          label="Select Campus"
          rules={[{ required: true, message: 'Please select a campus!' }]}
        >
          <Select>
            <Option value="hn">Hanoi</Option>
            <Option value="hcm">Ho Chi Minh</Option>
            <Option value="dn">Da Nang</Option>
            <Option value="ct">Can Tho</Option>
            <Option value="qn">Quy Nhon</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='username'
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
          />
        </Form.Item>

        <div className='flex justify-center'>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Log in
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default function LoginPage() {
  return (
    <main className='h-screen flex'>
      <div className='flex-1 grid place-items-center'>
        <LoginForm />
      </div>
      <div className='flex-1'>
        <img src='cover.jpg' className='w-full h-full object-cover' />
      </div>
    </main>
  )
}

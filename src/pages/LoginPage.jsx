import { Form, Input, Button, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { UserContext } from '../context/UserContextComponent';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const { login, user } = useContext(UserContext);

  switch (user?.role) {
    case 'admin':
      return <Navigate to='/admin' />;
    case 'teacher':
      return <Navigate to='/teacher' />;
    case 'student':
      return <Navigate to='/student' />;
  }

  const onFinish = async ({ username, password }) => {
    try {
      const user = await login(username, password);
      if (!user) {
        alert('Login failed');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='w-3/4'>
      <div className='text-center'>
        <h1 className='font-bold mb-3 text-2xl'>Login</h1>
      </div>
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

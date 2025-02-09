import MockDate from 'mockdate';
import React from 'react';
import Descriptions from '..';
import mountTest from '../../../tests/shared/mountTest';
import { resetWarned } from '../../_util/warning';
import { render } from '../../../tests/utils';
import ConfigProvider from '../../config-provider';

describe('Descriptions', () => {
  mountTest(Descriptions);

  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    MockDate.reset();
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('when max-width: 575px，column=1', () => {
    const wrapper = render(
      <Descriptions>
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
        <Descriptions.Item>No-Label</Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.querySelectorAll('tr')).toHaveLength(5);
    expect(wrapper.container.querySelectorAll('.ant-descriptions-item-label')).toHaveLength(4);
    wrapper.unmount();
  });

  it('when max-width: 575px，column=2', () => {
    // eslint-disable-next-line global-require
    const wrapper = render(
      <Descriptions column={{ xs: 2 }}>
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.querySelectorAll('tr')).toHaveLength(2);
    wrapper.unmount();
  });

  it('column is number', () => {
    // eslint-disable-next-line global-require
    const wrapper = render(
      <Descriptions column={3}>
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
    wrapper.unmount();
  });

  it('when typeof column is object', () => {
    const wrapper = render(
      <Descriptions column={{ xs: 8, sm: 16, md: 24 }}>
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
      </Descriptions>,
    );
    expect(
      Array.from(wrapper.container.querySelectorAll('td'))
        .map((i) => Number(i.getAttribute('colspan')))
        .filter(Boolean)
        .reduce((total, cur) => total + cur, 0),
    ).toBe(8);
    wrapper.unmount();
  });

  it('warning if exceed the row span', () => {
    resetWarned();

    render(
      <Descriptions column={3}>
        <Descriptions.Item label="Product" span={2}>
          Cloud Database
        </Descriptions.Item>
        <Descriptions.Item label="Billing" span={2}>
          Prepaid
        </Descriptions.Item>
      </Descriptions>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Descriptions] Sum of column `span` in a line not match `column` of Descriptions.',
    );
  });

  it('when item is rendered conditionally', () => {
    const hasDiscount = false;
    const wrapper = render(
      <Descriptions>
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
        {hasDiscount && <Descriptions.Item label="Discount">$20.00</Descriptions.Item>}
      </Descriptions>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
    wrapper.unmount();
  });

  it('vertical layout', () => {
    // eslint-disable-next-line global-require
    const wrapper = render(
      <Descriptions layout="vertical">
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
    wrapper.unmount();
  });

  it('Descriptions.Item support className', () => {
    const wrapper = render(
      <Descriptions>
        <Descriptions.Item label="Product" className="my-class">
          Cloud Database
        </Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('Descriptions support colon', () => {
    const wrapper = render(
      <Descriptions colon={false}>
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('Descriptions support style', () => {
    const wrapper = render(
      <Descriptions style={{ backgroundColor: '#e8e8e8' }}>
        <Descriptions.Item>Cloud Database</Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('keep key', () => {
    render(
      <Descriptions>
        <Descriptions.Item key="bamboo">1</Descriptions.Item>
      </Descriptions>,
    );
    expect(jest.spyOn(document, 'createElement')).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/19887
  it('should work with React Fragment', () => {
    if (!React.Fragment) {
      return;
    }
    const wrapper = render(
      <Descriptions>
        <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
        <>
          <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
          <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
        </>
      </Descriptions>,
    );

    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  // https://github.com/ant-design/ant-design/issues/20255
  it('columns 5 with customize', () => {
    const wrapper = render(
      <Descriptions layout="vertical" column={4}>
        {/* 1 1 1 1 */}
        <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
        <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
        <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
        <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
        {/* 2 2 */}
        <Descriptions.Item label="bamboo" span={2}>
          bamboo
        </Descriptions.Item>
        <Descriptions.Item label="bamboo" span={2}>
          bamboo
        </Descriptions.Item>
        {/* 3 1 */}
        <Descriptions.Item label="bamboo" span={3}>
          bamboo
        </Descriptions.Item>
        <Descriptions.Item label="bamboo">bamboo</Descriptions.Item>
      </Descriptions>,
    );

    function matchSpan(rowIndex: number, spans: number[]) {
      const trs = Array.from(wrapper.container.querySelectorAll('tr')).at(rowIndex);
      const tds = Array.from(trs?.querySelectorAll('th')!);
      expect(tds).toHaveLength(spans.length);
      tds.forEach((td, index) => {
        expect(Number(td.getAttribute('colSpan'))).toEqual(spans[index]);
      });
    }

    matchSpan(0, [1, 1, 1, 1]);
    matchSpan(2, [2, 2]);
    matchSpan(4, [3, 1]);
  });

  it('number value should render correct', () => {
    const wrapper = render(
      <Descriptions bordered>
        <Descriptions.Item label={0}>0</Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.querySelector('th')).toHaveClass('ant-descriptions-item-label');
    expect(wrapper.container.querySelector('td')).toHaveClass('ant-descriptions-item-content');
  });

  it('Descriptions support extra', () => {
    const wrapper1 = render(
      <Descriptions extra="Edit">
        <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
      </Descriptions>,
    );
    const wrapper2 = render(
      <Descriptions>
        <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper1.container.querySelector('.ant-descriptions-extra')).toBeTruthy();
    expect(wrapper2.container.querySelector('.ant-descriptions-extra')).toBeFalsy();
  });

  it('number 0 should render correct', () => {
    const wrapper = render(
      <Descriptions>
        <Descriptions.Item label={0} labelStyle={{ color: 'red' }} contentStyle={{ color: 'red' }}>
          {0}
        </Descriptions.Item>
      </Descriptions>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('should pass data-* and accessibility attributes', () => {
    const { getByTestId } = render(
      <Descriptions data-testid="test-id" data-id="12345" aria-describedby="some-label">
        <Descriptions.Item label="banana">banana</Descriptions.Item>
      </Descriptions>,
    );
    const container = getByTestId('test-id');
    expect(container).toHaveAttribute('data-id', '12345');
    expect(container).toHaveAttribute('aria-describedby', 'some-label');
  });

  it('Descriptions should inherit the size from ConfigProvider if the componentSize is set ', () => {
    const { container } = render(
      <ConfigProvider componentSize="small">
        <Descriptions bordered>
          <Descriptions.Item label="small">small</Descriptions.Item>
        </Descriptions>
      </ConfigProvider>,
    );
    expect(container.querySelectorAll('.ant-descriptions-small')).toHaveLength(1);
  });
});

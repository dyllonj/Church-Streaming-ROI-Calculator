import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ROICalculator = () => {
  const [inputs, setInputs] = useState({
    weeklyAttendance: 500,
    averageGiving: 50,
    streamingCost: 500,
    equipmentCost: 5000,
    staffHours: 10,
    onlineEngagement: 20,
  });

  const [projections, setProjections] = useState([]);

  const calculateProjections = () => {
    const months = 12;
    const data = [];
    
    for (let i = 0; i < months; i++) {
      // Conservative growth assumptions
      const onlineViewers = Math.floor(inputs.weeklyAttendance * 
        (inputs.onlineEngagement/100) * (1 + (i * 0.05)));
      
      const onlineGiving = onlineViewers * 
        (inputs.averageGiving * 0.6) * 4; // Assuming 60% giving rate of in-person
      
      const monthlyCosts = inputs.streamingCost + 
        (inputs.equipmentCost/12) + 
        (inputs.staffHours * 25 * 4); // $25/hr staff cost
      
      const roi = ((onlineGiving - monthlyCosts) / monthlyCosts) * 100;
      
      data.push({
        month: i + 1,
        viewers: onlineViewers,
        revenue: onlineGiving,
        costs: monthlyCosts,
        roi: Math.round(roi)
      });
    }
    
    setProjections(data);
  };

  useEffect(() => {
    calculateProjections();
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Church Streaming ROI Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Weekly In-Person Attendance
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={inputs.weeklyAttendance}
              onChange={(e) => handleInputChange('weeklyAttendance', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Average Weekly Giving per Person ($)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={inputs.averageGiving}
              onChange={(e) => handleInputChange('averageGiving', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Monthly Streaming Cost ($)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={inputs.streamingCost}
              onChange={(e) => handleInputChange('streamingCost', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Equipment Investment ($)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={inputs.equipmentCost}
              onChange={(e) => handleInputChange('equipmentCost', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Weekly Staff Hours
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={inputs.staffHours}
              onChange={(e) => handleInputChange('staffHours', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Expected Online Engagement (% of in-person)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={inputs.onlineEngagement}
              onChange={(e) => handleInputChange('onlineEngagement', e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">12 Month Projection</h3>
          <LineChart width={700} height={300} data={projections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label="Month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="roi" stroke="#8884d8" name="ROI %" />
            <Line type="monotone" dataKey="viewers" stroke="#82ca9d" name="Viewers" />
          </LineChart>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">First Year ROI</p>
              <p className="text-2xl">{projections[11]?.roi}%</p>
            </div>
            <div>
              <p className="font-medium">Monthly Revenue Potential</p>
              <p className="text-2xl">${Math.round(projections[11]?.revenue).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;

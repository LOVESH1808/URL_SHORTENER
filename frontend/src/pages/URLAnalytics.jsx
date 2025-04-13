import {
  Box,
  Button,
  Flex,
  Text,
  Toast,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  Link,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const URLAnalytics = () => {
  const history = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [longUrl, setLongUrl] = useState("");
  let { shortURL } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const browserData = analyticsData.reduce((acc, curr) => {
    const found = acc.find((item) => item.name === curr.browser);
    if (found) found.value += 1;
    else acc.push({ name: curr.browser, value: 1 });
    return acc;
  }, []);

  const COLORS = ["#3182ce", "#2f855a", "#dd6b20", "#d53f8c", "#805ad5"];
  const clicksOverTime = analyticsData
    .map((entry) => ({
      time: new Date(entry.timestamp).toLocaleDateString(),
      clicks: 1,
    }))
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.time === curr.time);
      if (existing) existing.clicks += 1;
      else acc.push({ ...curr });
      return acc;
    }, []);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/user/link/analytics/${shortURL}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLongUrl(response.data.longUrl);
        setAnalyticsData(response.data.analytics);
        setClickCount(response.data.clicks);
      } catch (err) {
        console.error("Error fetching analytics", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (shortURL) {
      fetchAnalytics();
    }
  }, [history]);

  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    if (!token) {
      history("/");
    }
  }, [history]);
  const handleClickLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    history("/");

    Toast({
      title: "Logout Successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };
  if (isLoading) {
    return (
      <Center h="100vh" w="100vw">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Center>
    );
  }
  return (
    <>
      <Flex p={4} flexDirection="column">
        <Button onClick={handleClickLogout} variant="outline">
          Logout
        </Button>
        <Box mt={4} textAlign="center">
          <Text fontWeight="semibold" mb={2}>
            Scan QR to visit Short URL:
          </Text>
          <QRCodeCanvas
            value={`http://localhost:5000/api/user/link/${shortURL}`}
            size={128}
          />
        </Box>
      </Flex>

      <Box maxW="6xl" mx="auto" p={4} textAlign="center">
        <Text fontSize="xl" fontWeight="bold">
          Analytics Dashboard
        </Text>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Total Clicks: {clickCount}
        </Text>
        <Box className="chce" w="3xl" textAlign="left" mb={4} flexWrap="wrap">
          <Box
            display="flex"
            alignItems="center"
            mb={2}
            border="1px solid #ccc"
            borderRadius="md"
          >
            <Text mr={2} fontSize="lg" fontWeight="bold">
              Long Url:
            </Text>
            <Link>{longUrl}</Link>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            border="1px solid #ccc"
            borderRadius="md"
          >
            <Text mr={2} fontSize="lg" fontWeight="bold">
              Short Url:
            </Text>
            <Link href={`http://localhost:5000/api/user/link/${shortURL}`}>
              {`http://localhost:5000/api/user/link/${shortURL}`}
            </Link>
          </Box>
        </Box>
        <Box display="flex" border="1px solid #ccc" borderRadius="md">
          <Box w="100%" h="300px" my={6}>
            <ResponsiveContainer width="60%" height="100%">
              <LineChart data={clicksOverTime}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="time" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3182ce"
                  dot={{ r: 4, stroke: "black", strokeWidth: 2, fill: "black" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Box w="50%" h="300px" my={6}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={browserData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#3182ce"
                  label
                >
                  {browserData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        <Box className="chce" w="3xl">
          <Table variant="simple" w="100%">
            <Thead>
              <Tr>
                <Th>Timestamp</Th>
                <Th>IP</Th>
                <Th>Device</Th>
                <Th>Browser</Th>
              </Tr>
            </Thead>
            <Tbody>
              {analyticsData.map((entry) => (
                <Tr key={entry._id}>
                  <Td>{new Date(entry.timestamp).toLocaleString()}</Td>
                  <Td>{entry.ip}</Td>
                  <Td>{entry.device}</Td>
                  <Td>{entry.browser}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </>
  );
};

export default URLAnalytics;

import axios from "axios";
import { CheckResult } from "../modules/results/checkResult.model.js";

export const runHeartbeat = async (check) => {
  const startTime = Date.now();

  try {
    const response = await axios({
      method: check.method,
      url: check.url,
      timeout: check.timeout,
    });

    const responseTime = Date.now() - startTime;

    await CheckResult.create({
      checkId: check._id,
      status: "up",
      responseTime,
      statusCode: response.status,
    });
  } catch (error) {
        const responseTime = Date.now() - startTime;

    await CheckResult.create({
      checkId: check._id,
      status: 'down',
      responseTime,
      statusCode: error.response?.status,
      error: error.message
    });
  }
};

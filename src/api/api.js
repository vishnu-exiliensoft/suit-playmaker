import axiosInstance from "./axiosInstance";

export const fetchFabricsData = async () => {
  try {
    const response = await axiosInstance.get(`/api/fabrics`);
    // yahi pe filter
    const filteredFabrics = response.data.filter(
      (fabric) => fabric.fabric_for === "Suit"
    );
    return { ...response, data: filteredFabrics };
  } catch (error) {
    throw error;
  }
};

export const fetchCollarsData = async () => {
  try {
    const response = await axiosInstance.get(`/api/collars`);
    // yahi pe filter
    const filteredCollars = response.data.filter(
      (collar) => collar.collar_for === "Shirt"
    );
    return { ...response, data: filteredCollars };
  } catch (error) {
    throw error;
  }
};

export const fetchLiningData = async () => {
  try {
    const response = await axiosInstance.get(`/api/fabrics`);
    // yahi pe filter
    const filteredLining = response.data.filter(
       (fabric) => fabric.fabric_for === "lining"
    );
    return { ...response, data: filteredLining };
  } catch (error) {
    throw error;
  }
};

export const fetchButtonThreadColorData = async () => {
  try {
    const response = await axiosInstance.get(`/api/fabrics`);
    // Filter for button/thread colors
    const filteredButtonThread = response.data.filter(
      (fabric) => fabric.fabric_for === "suitBtnThreadColor" || fabric.fabric_for === "suitBtnThreadColor"
    );
    return { ...response, data: filteredButtonThread };
  } catch (error) {
    throw error;
  }
};


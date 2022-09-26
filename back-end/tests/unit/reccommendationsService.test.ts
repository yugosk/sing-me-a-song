import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import {
  recommendationService,
  CreateRecommendationData,
} from "../../src/services/recommendationsService";
import { faker } from "@faker-js/faker";
import { conflictError } from "../../src/utils/errorUtils";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("recommendation service tests", () => {
  it("Recommendation should be created", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.name.fullName(),
      youtubeLink: "https://www.youtube.com/watch?v=x9yop0nYR9g",
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null);

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce(async () => {});

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalledTimes(1);
  });

  it("Duplicated recommendation should not be created", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.name.fullName(),
      youtubeLink: "https://www.youtube.com/watch?v=x9yop0nYR9g",
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce({ id: 1, score: 0, ...recommendation });

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce(async () => {});

    const result = await recommendationService.insert(recommendation);

    expect(result).rejects.toEqual(
      conflictError("Recommendations names should be unique")
    );

    expect(recommendationRepository.create).not.toBeCalled();
  });
});

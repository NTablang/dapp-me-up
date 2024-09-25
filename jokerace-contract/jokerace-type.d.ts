interface Contract {
    AMOUNT_FOR_SUMBITTER_PROOF: number;
    JK_LABS_ADDRESS: string;
    MAX_FIELDS_METADATA_LENGTH: number;
    METADATAS_COUNT: number;
    allProposalTotalVotes: bigint;
    canceled: boolean;
    contestDeadline: number;
    contestStart: number;
    costToPropose: number;
    costToVote: number;
    creator: string;
    creatorSplitDestination: string;
    downvotingAllowed: number;
    getAllAddressesThatHaveVoted: string[];
    jkLabsSplitDestination: string;
    maxProposalCount: number;
    metadataFieldsSchema: Record<string, unknown>;
    name: string;
    numAllowedProposalSubmissions: number;
    officialRewardsModule: string;
    payPerVote: number;
    percentageToCreator: number;
    prompt: string;
    rankLimit: number;
    sortingEnabled: number;
    state: number;
    submissionMerkleRoot: string;
    totalVotesCast: number;
    version: string;
    voteStart: number;
    votingDelay: number;
    votingMerkleRoot: string;
    votingPeriod: number;
    getSortedRanks: bigint[];
  }
  
  interface Proposal {
    ID: bigint;
    Author: string;
    Description: string;
    Exists: boolean;
    TargetAddress: string;
    SafeSigners: string;
    SafeThreshold: number;
    FieldsMetadata: {
      Addresses: string[];
      Strings: string[];
      Uints: number[];
    };
    ForVotes: number;
    AgainstVotes: number;
    Comments: Comment[];
  }
  
  interface Comment {
    ID: bigint;
    Author: string;
    Timestamp: string;
    ProposalID: bigint;
    Content: string;
  }